package com.maryna.LanguageCard.Services;

import com.maryna.LanguageCard.Models.CardModel;
import com.maryna.LanguageCard.Repositories.*;
import jakarta.transaction.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;


import java.util.List;
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

    public List<CardModel> getAll(int themaId) {
        return _cardRepository.getAll(themaId);
    }

    public CardModel getById(int id)throws BadRequestException {
        var card = _cardRepository.getById(id);
        if(card.isEmpty()){
            throw new BadRequestException("There is no such a card!");
        }
        return card.get();
    }

    @Transactional()
    public CardModel create(CardModel cardModel, int themaId)throws BadRequestException {
        if(!_themaRepository.exists(themaId)){
            throw new BadRequestException("There is no such a theme!");
        }
       cardModel = _cardRepository.create(cardModel);
        _themaCardRepository.bind(cardModel.getId(), themaId);
        return cardModel;
    }

    public CardModel update(CardModel cardModel)throws BadRequestException{
        var count = _cardRepository.selectOne(cardModel);
        if(count == 0){
            throw new BadRequestException("There is no such a card!");
        }
        var cardId = _cardRepository.update(cardModel);
        return getById(cardId);
    }

    public void delete(int id)throws BadRequestException{
        if(_cardSentanceRepository.exists(id)){
            throw new BadRequestException("This card has saved sentences!");
        }
        _cardRepository.delete(id);
    }
}



