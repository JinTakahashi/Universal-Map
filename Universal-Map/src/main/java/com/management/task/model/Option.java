package com.management.task.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Table(name = "options")
@Entity
@Getter
@Setter
public class Option {
    
    // User ID
    @Id
    @Column(name = "id")
    private UUID id;
    
    // 車椅子
    @Column(name = "wheelchair")
    private String wheelchair;
    
    // ベビーカー
    @Column(name = "stroller")
    private String stroller;
    
    // 杖（＝高齢者）
    @Column(name = "senior")
    private String senior;
    
    // 傾斜回避レベル（３段階）
    @Column(name = "slope")
    private int slope;
    
    // 移動速度（３段階）
    @Column(name = "speed")
    private int speed;
    
    // 言語
    @Column(name = "language")
    private String language;
    
}
