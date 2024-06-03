package edu.ucsb.cs156.example.integration;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.example.entities.RecommendationRequest;
import edu.ucsb.cs156.example.repositories.RecommendationRequestRepository;
import edu.ucsb.cs156.example.repositories.RestaurantRepository;
import edu.ucsb.cs156.example.repositories.UserRepository;
import edu.ucsb.cs156.example.services.CurrentUserService;
import edu.ucsb.cs156.example.services.GrantedAuthoritiesService;
import edu.ucsb.cs156.example.testconfig.TestConfig;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.time.LocalDateTime;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("integration")
@Import(TestConfig.class)
public class RecommendationRequestIT {
    @Autowired
    public CurrentUserService currentUserService;

    @Autowired
    public GrantedAuthoritiesService grantedAuthoritiesService;

    @Autowired
    RecommendationRequestRepository recommendationRequestRepository;

    @Autowired
    public MockMvc mockMvc;

    @Autowired
    public ObjectMapper mapper;

    @MockBean
    UserRepository userRepository;

    @WithMockUser(roles = { "USER" })
    @Test
    public void test_user_can_see_recrequest_when_logged_in() throws Exception{
        LocalDateTime first = LocalDateTime.parse("2024-04-26T08:08:00");
        LocalDateTime second = LocalDateTime.parse("2024-04-27T08:08:00");
        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("djensen2@outlook.com")
                .professorEmail("pconrad@ucsb.edu")
                .explanation("masters program")
                .dateRequested(first)
                .dateNeeded(second)
                .done(false)
                .build();

        recommendationRequestRepository.save(recommendationRequest1);

        MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=1"))
                .andExpect(status().isOk()).andReturn();

        String expected = mapper.writeValueAsString(recommendationRequest1);
        String responseString = response.getResponse().getContentAsString();

        assertEquals(expected, responseString);
    }

    @Test
    public void no_sign_in_then_unauthorized() throws Exception {
        LocalDateTime first = LocalDateTime.parse("2024-04-26T08:08:00");
        LocalDateTime second = LocalDateTime.parse("2024-04-27T08:08:00");
        RecommendationRequest recommendationRequest1 = RecommendationRequest.builder()
                .requesterEmail("djensen2@outlook.com")
                .professorEmail("pconrad@ucsb.edu")
                .explanation("masters program")
                .dateRequested(first)
                .dateNeeded(second)
                .done(false)
                .build();

        recommendationRequestRepository.save(recommendationRequest1);
        MvcResult response = mockMvc.perform(get("/api/recommendationrequest?id=1"))
                .andExpect(status().isForbidden()).andReturn();
    }

}
