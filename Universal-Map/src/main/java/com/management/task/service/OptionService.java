package com.management.task.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.management.task.model.Option;
import com.management.task.repository.OptionRepository;

@Service
public class OptionService {
    
    private final OptionRepository optionRepository;
    
    @Autowired
    public OptionService(OptionRepository optionRepository) {
        this.optionRepository = optionRepository;
    }
    
    public List<Option> findAll() {
        return this.optionRepository.findAll();
    }
    
    public void add(Option option) {
        if (option.getWheelchair() == null) {
            option.setWheelchair("false");
        }
        if (option.getStroller() == null) {
            option.setStroller("false");
        }
        if (option.getSenior() == null) {
            option.setSenior("false");
        }
        optionRepository.save(option);
    }
    
    @Transactional
    public void update(Option option) {
        optionRepository.update(option.getId(), option.getWheelchair(), option.getStroller(), option.getSenior(), option.getSlope(), option.getSpeed(), option.getLanguage());
    }
    
    public void delete(Option option) {
        optionRepository.delete(option);
    }
    
    public Option getByUserId(UUID userId) {
        return this.optionRepository.getByUserId(userId);
    }

}
