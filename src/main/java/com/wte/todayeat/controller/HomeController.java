package com.wte.todayeat.controller;

import com.wte.todayeat.model.Restaurant;
import com.wte.todayeat.service.WteApiService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Comparator;
import java.util.List;

@Controller
public class HomeController {
    @Autowired private WteApiService svc;

    @GetMapping("/") public String index() {return "index";}

    @PostMapping("/recommend")
    public String recommend(
       @RequestParam String area,
       @RequestParam String category,
       @RequestParam(defaultValue="default") String sort,
       @RequestParam String userX,
       @RequestParam String userY,
       Model m) throws IOException {
        String query= area + " " + category;
        List<Restaurant> list=svc.kakaoAPIsearchRestaurants(query,userX,userY);
        if(sort.equals("rating")) list.sort(Comparator.comparing(Restaurant::getRating).reversed());
        else if(sort.equals("distance")) list.sort(Comparator.comparing(Restaurant::getDistance));
        m.addAttribute("restaurants",list);
        m.addAttribute("userX",userX);
        m.addAttribute("userY",userY);
        return "index";
    }
}