package com.maryna.LanguageCard.Services;

import com.maryna.LanguageCard.Models.SentanceModel;
import com.maryna.LanguageCard.Repositories.*;
import org.springframework.transaction.annotation.Transactional;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SentanceService {
    private final SentanceRepository _sentanceRepository;
    private final CardRepository _cardRepository;
    private final CardSentanceRepository _cardSentanceRepository;
    public SentanceService(SentanceRepository sentenceCreate,  CardRepository cardRepository, CardSentanceRepository
                           cardSentanceRepository) {
        _sentanceRepository = sentenceCreate;
        _cardRepository = cardRepository;
        _cardSentanceRepository = cardSentanceRepository;
    }

    public List<SentanceModel> getAll() {
        return _sentanceRepository.getAll();
    }

    public SentanceModel getById(int id) throws BadRequestException {
        var sentence = _sentanceRepository.getById(id);
        if (sentence.isEmpty()) {
            throw new BadRequestException("There is no such a sentence!");
        }
        return sentence.get();
    }

    @Transactional
    public SentanceModel create(SentanceModel sentanceModel, int cardId) throws BadRequestException {
        if (!_cardRepository.exists(cardId)) {
            throw new BadRequestException("There is no such a card!");
        }
        sentanceModel = _sentanceRepository.create(sentanceModel);
        _cardSentanceRepository.bind(sentanceModel, cardId);
        return sentanceModel;
    }

    public void delete(int id) {
        _sentanceRepository.delete(id);
    }

    public SentanceModel update(SentanceModel sentanceModel) throws BadRequestException {
        var count = _sentanceRepository.selectOne(sentanceModel);
        if (count == 0) {
            throw new BadRequestException("There is no such a sentence!");
        }
        var sentenceId = _sentanceRepository.update(sentanceModel);
        return getById(sentenceId);
    }
}

