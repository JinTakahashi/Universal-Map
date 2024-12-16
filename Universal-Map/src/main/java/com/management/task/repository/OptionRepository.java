package com.management.task.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.management.task.model.Option;


public interface OptionRepository extends JpaRepository<Option, UUID>{
    
    @Query(nativeQuery = true, value = "SELECT * FROM options WHERE id = :id LIMIT 1")
    Option getByUserId(@Param("id") UUID id);
    
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE options SET wheelchair = :wheelchair, stroller = :stroller, senior = :senior, slope = :slope, speed = :speed, language = :language WHERE id = :id")
    void update(@Param("id") UUID id, @Param("wheelchair") String wheelchair, @Param("stroller") String stroller, @Param("senior") String senior, @Param("slope") int slope, @Param("speed") int speed, @Param("language") String language);
    
}
