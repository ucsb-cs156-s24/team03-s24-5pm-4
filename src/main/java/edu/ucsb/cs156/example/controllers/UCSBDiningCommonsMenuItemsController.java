package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.entities.UCSBDate;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItems;
import edu.ucsb.cs156.example.entities.UCSBDiningCommons;
import edu.ucsb.cs156.example.errors.EntityNotFoundException;
import edu.ucsb.cs156.example.repositories.UCSBDateRepository;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemsRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import java.time.LocalDateTime;


@Tag(name = "UCSBDiningCommonsMenuItems")
@RequestMapping("/api/ucsbdiningcommonsmenuitems")
@RestController
@Slf4j
public class UCSBDiningCommonsMenuItemsController extends ApiController {

    @Autowired
    UCSBDiningCommonsMenuItemsRepository ucsbDiningCommonsMenuItemsRepository;

    @Operation(summary= "List all ucsb dining common menu items")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("/all")
    public Iterable<UCSBDiningCommonsMenuItems> allUCSBDiningCommonsMenuItems() {
        Iterable<UCSBDiningCommonsMenuItems> menuItems  = ucsbDiningCommonsMenuItemsRepository.findAll();
        return menuItems;
    }


    @Operation(summary= "Create a new item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping("/post")
    public UCSBDiningCommonsMenuItems postCommonsMenuItems (
            @Parameter(name="diningCommonsCode") @RequestParam String diningCommonsCode,
            @Parameter(name="name") @RequestParam String name,
            @Parameter(name="station") @RequestParam String station) 
            throws JsonProcessingException{
        
        UCSBDiningCommonsMenuItems items = new UCSBDiningCommonsMenuItems();
        items.setDiningCommonsCode(diningCommonsCode);
        items.setName(name);
        items.setStation(station);

        UCSBDiningCommonsMenuItems saveditems = ucsbDiningCommonsMenuItemsRepository.save(items);

        return saveditems;
        }
    
    
    @Operation(summary= "Get a single item")
    @PreAuthorize("hasRole('ROLE_USER')")
    @GetMapping("")
    public UCSBDiningCommonsMenuItems getById(
        @Parameter(name="id") @RequestParam long id) {
            UCSBDiningCommonsMenuItems item = ucsbDiningCommonsMenuItemsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItems.class, id));
    
            return item;
        }


    @Operation(summary= "Gets a single menu item then edits it")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping("")
    public UCSBDiningCommonsMenuItems editUCSBDiningCommonsMenuItems(
        @Parameter(name = "id") @RequestParam Long id,
        @RequestBody @Valid UCSBDiningCommonsMenuItems editedMenuItem){

        UCSBDiningCommonsMenuItems ucsbDiningCommonsMenuItems = ucsbDiningCommonsMenuItemsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItems.class, id));
        ucsbDiningCommonsMenuItems.setDiningCommonsCode(editedMenuItem.getDiningCommonsCode());
        ucsbDiningCommonsMenuItems.setName(editedMenuItem.getName());
        ucsbDiningCommonsMenuItems.setStation(editedMenuItem.getStation());

        ucsbDiningCommonsMenuItemsRepository.save(ucsbDiningCommonsMenuItems);

        return ucsbDiningCommonsMenuItems;
        }
        

    @Operation(summary= "Deletes a menu item")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping("")
    public Object deleteUCSBDiningCommonsMenuItems(
        @Parameter(name = "id") @RequestParam Long id){
        UCSBDiningCommonsMenuItems ucsbDiningCommonsMenuItems = ucsbDiningCommonsMenuItemsRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException(UCSBDiningCommonsMenuItems.class, id));
        ucsbDiningCommonsMenuItemsRepository.delete(ucsbDiningCommonsMenuItems);
        return genericMessage("UCSBDiningCommonsMenuItems %s deleted".formatted(id));
        }



        
}
