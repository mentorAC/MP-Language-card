package com.maryna.LanguageCard.Controllers;

import com.maryna.LanguageCard.Models.CardModel;
import com.maryna.LanguageCard.Services.CardService;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
public class CardsController {
    private final CardService _cardService;

    public CardsController(CardService cardService) {
        _cardService = cardService;
    }

    @GetMapping()
    public List<CardModel> getCards(@RequestParam int themaId) {
        return _cardService.getAll(themaId);
    }

    @GetMapping("/{id}")
    public CardModel getCard(int id) throws BadRequestException {
        return _cardService.getById(id);
    }

    @PostMapping()
    public CardModel createCard(@RequestBody CardModel cardModel)throws BadRequestException {
        return _cardService.create(cardModel);
    }

    @PutMapping()
    public CardModel updateCard(@RequestBody CardModel cardModel) throws BadRequestException {
        return _cardService.update(cardModel);
    }

    @DeleteMapping("/{id}")
    public void deleteCard(int id)throws BadRequestException {
        _cardService.delete(id);
    }
}


