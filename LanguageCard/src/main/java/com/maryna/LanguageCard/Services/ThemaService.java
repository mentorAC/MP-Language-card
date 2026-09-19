package com.maryna.LanguageCard.Services;

import com.maryna.LanguageCard.Models.PageModel;
import com.maryna.LanguageCard.Models.PageRequestModel;
import com.maryna.LanguageCard.Models.ThemaModel;
import com.maryna.LanguageCard.Repositories.ThemaCardRepository;
import com.maryna.LanguageCard.Repositories.ThemaRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ThemaService {
    private final ThemaRepository _themaRepository;
    private final ThemaCardRepository _themaCardRepository;

    public ThemaService(ThemaRepository themaRepository, ThemaCardRepository themaCardRepository) {
        _themaRepository = themaRepository;
        _themaCardRepository = themaCardRepository;
    }

    public PageModel<ThemaModel> getPage(PageRequestModel pageRequest) {
        var items = _themaRepository.getPage(pageRequest.limit(), pageRequest.offset());
        var total = _themaRepository.count();
        return new PageModel<>(items, pageRequest.page(), pageRequest.size(), total);
    }

    public ThemaModel getById(int id) throws BadRequestException {
        return _themaRepository.getById(id)
                .orElseThrow(() -> new BadRequestException("There is no such a theme!"));
    }

    public ThemaModel create(String name) {
        return _themaRepository.create(name);
    }

    @Transactional
    public ThemaModel update(ThemaModel themaModel) throws BadRequestException {
        if (!_themaRepository.exists(themaModel.getId())) {
            throw new BadRequestException("There is no such a theme!");
        }
        _themaRepository.update(themaModel);
        return getById(themaModel.getId());
    }

    @Transactional
    public void delete(int id) throws BadRequestException {
        if (!_themaRepository.exists(id)) {
            throw new BadRequestException("There is no such a theme!");
        }
        if (_themaCardRepository.hasCards(id)) {
            throw new BadRequestException("This theme has cards!");
        }
        _themaRepository.delete(id);
    }
}
