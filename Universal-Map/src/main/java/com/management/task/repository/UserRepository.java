package com.management.task.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.management.task.model.User;


public interface UserRepository extends JpaRepository<User, UUID>{
    
    @Query(nativeQuery = true, value = "SELECT * FROM users WHERE id = :id LIMIT 1")
    User getByUserId(@Param("id") UUID id);
    
    @Query(nativeQuery = true, value = "SELECT * FROM users WHERE loginid = :loginid LIMIT 1")
    User getByLoginId(@Param("loginid") String loginid);
    
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE users SET loginid = :loginid, username = :username, password = :password WHERE id = :id")
    void update(@Param("id") UUID id, @Param("loginid") String loginid, @Param("username") String username, @Param("password") String password);
    
}
