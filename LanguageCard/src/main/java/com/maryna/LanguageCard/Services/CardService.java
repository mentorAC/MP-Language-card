package com.maryna.LanguageCard.Services;

import com.maryna.LanguageCard.Models.CardModel;
import com.maryna.LanguageCard.Models.PageModel;
import com.maryna.LanguageCard.Models.PageRequestModel;
import com.maryna.LanguageCard.Repositories.*;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class CardService {
    private final CardRepository _cardRepository;
    private final ThemaRepository _themaRepository;
    private final ThemaCardRepository _themaCardRepository;
    private final CardSentanceRepository _cardSentanceRepository;

    public CardService(CardRepository cardRepository, ThemaRepository themaRepository, ThemaCardRepository themaCard,
                       CardSentanceRepository cardSentanceRepository) {
        _cardRepository = cardRepository;
        _themaRepository = themaRepository;
        _themaCardRepository = themaCard;
        _cardSentanceRepository = cardSentanceRepository;
    }

    public PageModel<CardModel> getPage(int themaId, PageRequestModel pageRequest) {
        var items = _cardRepository.getPage(themaId, pageRequest.limit(), pageRequest.offset());
        var total = _cardRepository.count(themaId);
        return new PageModel<>(items, pageRequest.page(), pageRequest.size(), total);
    }

    public CardModel getById(int id) throws BadRequestException {
        var card = _cardRepository.getById(id)
                .orElseThrow(() -> new BadRequestException("There is no such a card!"));
        card.setThemas(_themaCardRepository.getThemasByCard(id));
        return card;
    }

    @Transactional
    public CardModel create(CardModel cardModel) throws BadRequestException {
        var themaIds = cardModel.themaIds();
        requireThemasExist(themaIds);

        var created = _cardRepository.create(cardModel);
        for (var themaId : themaIds) {
            _themaCardRepository.bind(created.getId(), themaId);
        }
        return getById(created.getId());
    }

    @Transactional
    public CardModel update(CardModel cardModel) throws BadRequestException {
        if (!_cardRepository.exists(cardModel.getId())) {
            throw new BadRequestException("There is no such a card!");
        }
        var themaIds = cardModel.themaIds();
        requireThemasExist(themaIds);

        _cardRepository.update(cardModel);
        syncThemas(cardModel.getId(), themaIds);
        return getById(cardModel.getId());
    }

    @Transactional
    public void delete(int id) throws BadRequestException {
        if (!_cardRepository.exists(id)) {
            throw new BadRequestException("There is no such a card!");
        }
        if (_cardSentanceRepository.hasSentances(id)) {
            throw new BadRequestException("This card has saved sentences!");
        }
        _cardRepository.delete(id);
    }

    private void requireThemasExist(Set<Integer> themaIds) throws BadRequestException {
        for (var themaId : themaIds) {
            if (!_themaRepository.exists(themaId)) {
                throw new BadRequestException("There is no such a theme!");
            }
        }
    }

    /**
     * Brings the card's theme links in line with what was sent: only the rows
     * that actually changed are touched, so re-saving an unchanged card leaves
     * the join table alone.
     */
    private void syncThemas(int cardId, Set<Integer> wanted) {
        var current = new HashSet<>(_themaCardRepository.getThemaIdsByCard(cardId));

        for (var themaId : current) {
            if (!wanted.contains(themaId)) {
                _themaCardRepository.unbind(cardId, themaId);
            }
        }
        for (var themaId : wanted) {
            if (!current.contains(themaId)) {
                _themaCardRepository.bind(cardId, themaId);
            }
        }
    }
}
