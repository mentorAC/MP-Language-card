package com.maryna.LanguageCard.Controllers;

import com.maryna.LanguageCard.Models.PageModel;
import com.maryna.LanguageCard.Models.PageRequestModel;
import com.maryna.LanguageCard.Models.ThemaModel;
import com.maryna.LanguageCard.Services.ThemaService;
import jakarta.validation.Valid;
import org.apache.coyote.BadRequestException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/themas")
public class ThemasController {
    private final ThemaService _themaService;

    public ThemasController(ThemaService themaService) {
        _themaService = themaService;
    }

    @GetMapping()
    public PageModel<ThemaModel> getThemas(@RequestParam(required = false) Integer page,
                                           @RequestParam(required = false) Integer size) {
        return _themaService.getPage(PageRequestModel.of(page, size));
    }

    @GetMapping("/{id}")
    public ThemaModel getThema(@PathVariable int id) throws BadRequestException {
        return _themaService.getById(id);
    }

    @PostMapping()
    public ThemaModel createThema(@Valid @RequestBody ThemaModel themaModel) {
        return _themaService.create(themaModel.getName());
    }

    @PutMapping()
    public ThemaModel updateThema(@Valid @RequestBody ThemaModel themaModel) throws BadRequestException {
        return _themaService.update(themaModel);
    }

    @DeleteMapping("/{id}")
    public void deleteThema(@PathVariable int id) throws BadRequestException {
        _themaService.delete(id);
    }
}
