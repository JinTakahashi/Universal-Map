package com.management.task.controller;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.management.task.model.Option;
import com.management.task.model.User;
import com.management.task.service.OptionService;
import com.management.task.service.UserService;

@Controller
public class HomeController {
    
    private final UserService userService;
    private final OptionService optionService;
    
    @Autowired
    public HomeController(UserService userService, OptionService optionService) {
        this.userService = userService;
        this.optionService = optionService;
    }
    
    @GetMapping("/login")
    String loginGet(Model model) {
        model.addAttribute("userLoginForm", new User());
        return "login";
    }
    
    @PostMapping("/login")
    String loginPost(@ModelAttribute("userLoginForm") User loginUser, RedirectAttributes redirectAttributes) {
        User trueUser = userService.getByLoginId(loginUser.getLoginId());
        if (trueUser == null || !trueUser.getPassword().equals(loginUser.getPassword())) {
            return "redirect:login";
        } else {
            UUID userId = trueUser.getId();
            Option option = optionService.getByUserId(trueUser.getId());
            redirectAttributes.addAttribute("id", userId);
            redirectAttributes.addAttribute("language", option.getLanguage());
            redirectAttributes.addAttribute("wheelchair", option.getWheelchair());
            redirectAttributes.addAttribute("stroller", option.getStroller());
            redirectAttributes.addAttribute("senior", option.getSenior());
            redirectAttributes.addAttribute("slope", option.getSlope());
            redirectAttributes.addAttribute("speed", option.getSpeed());
            return "redirect:index";
        }
    }
    
    @GetMapping("/create")
    String createGet(Model model) {
        model.addAttribute("userCreateForm", new User());
        return "create";
    }
    
    @PostMapping("/create")
    String createPost(@ModelAttribute("userCreateForm") User user, RedirectAttributes redirectAttributes) {
        System.out.println(userService.getByLoginId(user.getLoginId()));
        if (userService.getByLoginId(user.getLoginId()) == null) {
            userService.add(user);
            UUID id = userService.getByLoginId(user.getLoginId()).getId();
            redirectAttributes.addAttribute("id", id);
            return "redirect:option";
        } else {
            return "redirect:login";
        }
    }
    
    @GetMapping("/option")
    String optionGet(Model model, @RequestParam("id") String id) {
        Option option = new Option();
        option.setId(UUID.fromString(id));
        model.addAttribute("optionCreateForm", option);
        return "option";
    }
    
    @PostMapping("/option")
    String optionPost(@ModelAttribute("optionCreateForm") Option option) {
        optionService.add(option);
        return "redirect:login";
    }
    
    @GetMapping("/update")
    String updateGet(Model model, @RequestParam("id") String id, @RequestParam("language") String language, @RequestParam("wheelchair") String wheelchair, @RequestParam("stroller") String stroller, @RequestParam("senior") String senior, @RequestParam("slope") String slope, @RequestParam("speed") String speed) {
        User user = userService.getByUserId(UUID.fromString(id));
        Option option = optionService.getByUserId(user.getId());
        model.addAttribute("userUpdateForm", user);
        model.addAttribute("user", user);
        model.addAttribute("option", option);
        return "update";
    }
    
    @PostMapping("/update")
    String updatePost(@ModelAttribute("userUpdateForm") User user, RedirectAttributes redirectAttributes) {
        Option option = optionService.getByUserId(user.getId());
        userService.update(user);
        redirectAttributes.addAttribute("id", user.getId());
        redirectAttributes.addAttribute("language", option.getLanguage());
        redirectAttributes.addAttribute("wheelchair", option.getWheelchair());
        redirectAttributes.addAttribute("stroller", option.getStroller());
        redirectAttributes.addAttribute("senior", option.getSenior());
        redirectAttributes.addAttribute("slope", option.getSlope());
        redirectAttributes.addAttribute("speed", option.getSpeed());
        return "redirect:setting";
    }
    
    @GetMapping("/delete")
    String delete(@RequestParam("id") String id) {
        User user = userService.getByUserId(UUID.fromString(id));
        Option option = optionService.getByUserId(user.getId());
        userService.delete(user);
        optionService.delete(option);
        return "redirect:login";
    }
    
    @GetMapping("/index")
    String index(Model model, @RequestParam("id") String id, @RequestParam("language") String language, @RequestParam("wheelchair") String wheelchair, @RequestParam("stroller") String stroller, @RequestParam("senior") String senior, @RequestParam("slope") String slope, @RequestParam("speed") String speed) {
        User user = userService.getByUserId(UUID.fromString(id));
        Option option = optionService.getByUserId(UUID.fromString(id));
        option.setLanguage(language);
        option.setWheelchair(wheelchair);
        option.setStroller(stroller);
        option.setSenior(senior);
        option.setSlope(Integer.parseInt(slope));
        option.setSpeed(Integer.parseInt(speed));
        optionService.update(option);
        model.addAttribute("user", user);
        model.addAttribute("option", option);
        return "index";
    }
    
    @GetMapping("/setting")
    String settingGet(@RequestParam("id") String id, Model model) {
        User user = userService.getByUserId(UUID.fromString(id));
        Option option = optionService.getByUserId(UUID.fromString(id));
        String password = "";
        for (int i = 0; i < user.getPassword().length(); i++) {
            password += "･︎";
        }
        model.addAttribute("user", user);
        model.addAttribute("option", option);
        model.addAttribute("password", password);
        return "setting";
    }
    
}
