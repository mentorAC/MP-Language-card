package com.maryna.LanguageCard.Controllers;

import com.maryna.LanguageCard.Models.CardModel;
import com.maryna.LanguageCard.Models.PageModel;
import com.maryna.LanguageCard.Models.PageRequestModel;
import com.maryna.LanguageCard.Services.CardService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cards")
public class CardsController {
    private final CardService _cardService;

    public CardsController(CardService cardService) {
        _cardService = cardService;
    }

    /** Without `themaId` the page lists every card; with it, only that theme's. */
    @GetMapping()
    public PageModel<CardModel> getCards(@RequestParam(required = false) Integer themaId,
                                         @RequestParam(required = false) Integer page,
                                         @RequestParam(required = false) Integer size) {
        return _cardService.getPage(themaId == null ? 0 : themaId, PageRequestModel.of(page, size));
    }

    @GetMapping("/{id}")
    public CardModel getCard(@PathVariable int id) throws BadRequestException {
        return _cardService.getById(id);
    }

    @PostMapping()
    public CardModel createCard(@Valid @RequestBody CardModel cardModel) throws BadRequestException {
        return _cardService.create(cardModel);
    }

    @PutMapping()
    public CardModel updateCard(@Valid @RequestBody CardModel cardModel) throws BadRequestException {
        return _cardService.update(cardModel);
    }

    @DeleteMapping("/{id}")
    public void deleteCard(@PathVariable int id) throws BadRequestException {
        _cardService.delete(id);
    }
}
