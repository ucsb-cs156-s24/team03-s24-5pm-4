package edu.ucsb.cs156.example.controllers;

import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.testconfig.TestConfig;
//import liquibase.pro.packaged.eq;
import edu.ucsb.cs156.example.ControllerTestCase;
import edu.ucsb.cs156.example.entities.UCSBDiningCommonsMenuItems;
import edu.ucsb.cs156.example.repositories.UCSBDiningCommonsMenuItemsRepository;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = UCSBDiningCommonsMenuItemsController.class)
@Import(TestConfig.class)
public class UCSBDiningCommonsMenuItemsControllerTests extends ControllerTestCase {

    @MockBean
    UCSBDiningCommonsMenuItemsRepository ucsbDiningCommonsMenuItemsRepository;

    @MockBean
    UserRepository userRepository;

    // Tests for GET 

    @Test
    public void logged_out_users_cannot_get_all() throws Exception {
            mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems/all"))
                            .andExpect(status().is(403)); // logged out users can't get all
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all_items() throws Exception {
            mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems/all"))
                            .andExpect(status().is(200)); // logged
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all_menu_items() throws Exception {
        UCSBDiningCommonsMenuItems MenuItem1 = UCSBDiningCommonsMenuItems.builder()
                                .diningCommonsCode("De La Guerra")
                                .name("Lentil and Brown Rice Soup (vgn)")
                                .station("Blue Plate Special")
                                .build();

        UCSBDiningCommonsMenuItems MenuItem2 = UCSBDiningCommonsMenuItems.builder()
                                .diningCommonsCode("Carillo")
                                .name("Oatmeal (vgn)")
                                .station("Grill (Cafe)")
                                .build();
        ArrayList<UCSBDiningCommonsMenuItems> expectedMenuItems = new ArrayList<>();
        expectedMenuItems.addAll(Arrays.asList(MenuItem1,MenuItem2));

        when(ucsbDiningCommonsMenuItemsRepository.findAll()).thenReturn(expectedMenuItems);

        //act
        MvcResult response = mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems/all"))
                        .andExpect(status().isOk()).andReturn();
                                
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findAll();
        String expectedJson = mapper.writeValueAsString(expectedMenuItems);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
        



    }

    //test for posts
    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_users_can_get_all() throws Exception {
            mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems/all"))
                            .andExpect(status().is(200)); // logged
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_regular_users_cannot_post() throws Exception {
            mockMvc.perform(post("/api/ucsbdiningcommonsmenuitems/post"))
                            .andExpect(status().is(403)); // need ADMIN role to post
    }

    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void an_admin_user_can_post_a_new_UCSBDiningCommonsMenuItem() throws Exception {

        UCSBDiningCommonsMenuItems Item1 = UCSBDiningCommonsMenuItems.builder()
                                .diningCommonsCode("Portola")
                                .name("Sage & Sweet Potato Soup (v)")
                                .station("Greens & Grains")
                                .build();
        
        when(ucsbDiningCommonsMenuItemsRepository.save(eq(Item1))).thenReturn(Item1);

        //act
        MvcResult response = mockMvc.perform(post("/api/ucsbdiningcommonsmenuitems/post")
        .param("diningCommonsCode", "Portola")
        .param("name", "Sage & Sweet Potato Soup (v)")
        .param("station", "Greens & Grains")
        .with(csrf())).andExpect(status().isOk()).andReturn();

        //assert
        verify(ucsbDiningCommonsMenuItemsRepository,times(1)).save(Item1);
        String expectedJson = mapper.writeValueAsString(Item1);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson,responseString);

    }

    //tests for single get
    @Test
    public void logged_out_users_cannot_get_by_id() throws Exception {
        mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems/all"))
        .andExpect(status().is(403)); // logged out users can't get by id
 
    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_that_logged_in_user_can_get_by_id_when_the_id_exists() throws Exception {
        UCSBDiningCommonsMenuItems item = UCSBDiningCommonsMenuItems.builder()
            .diningCommonsCode("Portola")
            .name("Sage & Sweet Potato Soup (v)")
            .station("Greens & Grains")
            .build();

        when(ucsbDiningCommonsMenuItemsRepository.findById(eq(12L))).thenReturn(Optional.of(item));

        // act
        MvcResult response = mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems?id=12"))
                        .andExpect(status().isOk()).andReturn();
        //assert
        verify(ucsbDiningCommonsMenuItemsRepository,times(1)).findById(eq(12L));
        String expectedJson = mapper.writeValueAsString(item);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson,responseString);

    }

    @WithMockUser(roles = { "USER" })
    @Test
    public void logged_in_user_can_get_id_when_the_id_does_not_exist() throws Exception {

            // arrange
            when(ucsbDiningCommonsMenuItemsRepository.findById(eq(12L))).thenReturn(Optional.empty());

            // act
            MvcResult response = mockMvc.perform(get("/api/ucsbdiningcommonsmenuitems?id=12"))
                            .andExpect(status().isNotFound()).andReturn();

            // assert
            verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findById(eq(12L));
            Map<String, Object> json = responseToJson(response);
            assertEquals("EntityNotFoundException", json.get("type"));
            assertEquals("UCSBDiningCommonsMenuItems with id 12 not found", json.get("message"));
    }
    

    //test for edit
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_can_edit_an_existing_menu_item() throws Exception {
        //arrange
        UCSBDiningCommonsMenuItems originalMenuItems = UCSBDiningCommonsMenuItems.builder()
            .diningCommonsCode("Portola")
            .name("Sage & Sweet Potato Soup (v)")
            .station("Greens & Grains")
            .build();

        UCSBDiningCommonsMenuItems editedMenuItems = UCSBDiningCommonsMenuItems.builder()
        .diningCommonsCode("De La Guerra")
        .name("Mixed Vegetables (vgn)")
        .station("BluePlateSpecial")
        .build();

        String requestBody = mapper.writeValueAsString(editedMenuItems);
        when(ucsbDiningCommonsMenuItemsRepository.findById(eq(475L))).thenReturn(Optional.of(originalMenuItems));

        //act
        MvcResult response = mockMvc.perform(
            put("/api/ucsbdiningcommonsmenuitems?id=475")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8")
                .content(requestBody)
                .with(csrf()))
                .andExpect(status().isOk()).andReturn();

        //assert
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findById(475L);
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).save(editedMenuItems); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }


    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void admin_cannot_edit_menu_item_that_does_not_exist() throws Exception {
        UCSBDiningCommonsMenuItems editedCommonMenuItems = UCSBDiningCommonsMenuItems.builder()
            .diningCommonsCode("Carillo")
            .name("Noodles")
            .station("Asian")
            .build();
        
        String request = mapper.writeValueAsString(editedCommonMenuItems);

        when(ucsbDiningCommonsMenuItemsRepository.findById(eq(987L))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
            put("/api/ucsbdiningcommonsmenuitems?id=987")
                .contentType(MediaType.APPLICATION_JSON)
                .characterEncoding("utf-8")
                .content(request)
                .with(csrf()))
                .andExpect(status().isNotFound()).andReturn();
        //assert
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findById(987L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBDiningCommonsMenuItems with id 987 not found", json.get("message"));

    }
    
    // test for delete
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void delete_menu_item() throws Exception {
        //arrange
        UCSBDiningCommonsMenuItems menuItem = UCSBDiningCommonsMenuItems.builder()
        .diningCommonsCode("Portola")
        .name("Sushi")
        .station("Asian")
        .build();

        when(ucsbDiningCommonsMenuItemsRepository.findById(eq(576L))).thenReturn(Optional.of(menuItem));

        //act
        MvcResult response = mockMvc.perform(
            delete("/api/ucsbdiningcommonsmenuitems?id=576")
            .with(csrf()))
            .andExpect(status().isOk()).andReturn();

        //assert
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findById(576L);
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).delete(any());
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBDiningCommonsMenuItems 576 deleted", json.get("message"));

        
    }
    @WithMockUser(roles = { "ADMIN", "USER" })
    @Test
    public void delete_menu_item_with_invalid_id() throws Exception{
        //arrange
        when(ucsbDiningCommonsMenuItemsRepository.findById(eq(495L))).thenReturn(Optional.empty());
        
        //act

        MvcResult response = mockMvc.perform(
            delete("/api/ucsbdiningcommonsmenuitems?id=495")
            .with(csrf()))
            .andExpect(status().isNotFound()).andReturn();
        //assert
        verify(ucsbDiningCommonsMenuItemsRepository, times(1)).findById(495L);
        Map<String, Object> json = responseToJson(response);
        assertEquals("UCSBDiningCommonsMenuItems with id 495 not found", json.get("message"));
    }
}
