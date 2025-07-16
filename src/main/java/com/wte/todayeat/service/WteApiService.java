package com.wte.todayeat.service;

import com.wte.todayeat.model.Restaurant;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
import java.util.*;
import java.util.stream.Collectors;

import javax.net.ssl.HttpsURLConnection;

@Service
public class WteApiService {

    private static final String KAKAO_REST_API_KEY = "KakaoAK 67aa2eeac184ff2d928f3bda9fb298ec";
    private static final String KAKAO_SEARCH_API_URL = "https://dapi.kakao.com/v2/local/search/keyword.json?query=";
    
    //카카오 카테고리 별 목록 조회 API
    public List<Restaurant> kakaoAPIsearchRestaurants(String query, String userX, String userY) throws IOException {
    	String url = KAKAO_SEARCH_API_URL +
    	           URLEncoder.encode(query, "UTF-8") + "&category_group_code=FD6&size=10";
    	        HttpsURLConnection conn = (HttpsURLConnection)new URL(url).openConnection();
    	        conn.setRequestProperty("Authorization", KAKAO_REST_API_KEY);
    	        BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
    	        String line = br.lines().collect(Collectors.joining());
    	        br.close();

    	        JSONArray docs = new JSONObject(line).getJSONArray("documents");
    	        List<Restaurant> list = new ArrayList<>();

    	        for (int i = 0; i < docs.length(); i++) {
    	            JSONObject o = docs.getJSONObject(i);
    	            double rx = o.getDouble("x");
    	            double ry = o.getDouble("y");
    	            double ux = Double.parseDouble(userX);
    	            double uy = Double.parseDouble(userY);

    	            // 거리 계산 (미터 → 킬로미터 → 소수점 1자리 반올림)
    	            double meters = calcDistance(uy, ux, ry, rx);
    	            double km = Math.round((meters / 1000.0) * 10) / 10.0;

    	            Restaurant r = new Restaurant(
    	                    o.getString("place_name"),
    	                    o.getString("address_name"),
    	                    String.valueOf(rx),
    	                    String.valueOf(ry),
    	                    o.getString("place_url"),
    	                    km,
    	                    Math.round((3 + Math.random() * 2) * 10) / 10.0,
    	                    false
    	            );

    	            list.add(r);
    	        }

    	        return list;
    }
    // 거리 계산 (Haversine 공식)
    private double calcDistance(double lat1, double lon1, double lat2, double lon2) {
    	double R = 6371e3; // 지구 반지름 (미터)
    	double φ1 = Math.toRadians(lat1);
    	double φ2 = Math.toRadians(lat2);
    	double Δφ = Math.toRadians(lat2 - lat1);
    	double Δλ = Math.toRadians(lon2 - lon1);
    	
    	double a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    	                   Math.cos(φ1) * Math.cos(φ2) *
    	                   Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    	double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    	return R * c; // meter
    }
}