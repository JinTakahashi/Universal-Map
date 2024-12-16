package com.management.task.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.management.task.model.User;
import com.management.task.repository.UserRepository;

@Service
public class UserService {
    
    private final UserRepository userRepository;
    
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    public List<User> findAll() {
        return this.userRepository.findAll();
    }
    
    public void add(User user) {
        userRepository.save(user);
    }
    
    @Transactional
    public void update(User user) {
        userRepository.update(user.getId(), user.getLoginId(), user.getUserName(), user.getPassword());
    }
    
    public void delete(User user) {
        userRepository.delete(user);
    }
    
    public User getByUserId(UUID userId) {
        return this.userRepository.getByUserId(userId);
    }
    
    public User getByLoginId(String loginId) {
        return this.userRepository.getByLoginId(loginId);
    }

}
