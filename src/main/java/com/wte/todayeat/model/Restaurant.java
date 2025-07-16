package com.wte.todayeat.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
public class Restaurant {
    private String name;
    private String address;
    private String x;         // 경도
    private String y;         // 위도
    private String placeUrl;
    private double distance;  // Km 단위 (소수점 반올림된 값)
    private double rating;    // 별점 (3.0 ~ 5.0 랜덤)
    private boolean favorite; // 즐겨찾기 여부
}