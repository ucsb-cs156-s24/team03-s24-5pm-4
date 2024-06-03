package edu.ucsb.cs156.example.web;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = DirtiesContext.ClassMode.BEFORE_EACH_TEST_METHOD)
public class RecommendationRequestWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_recrequest() throws Exception{
        setupUser(true);
        page.getByText("Recommendation Requests").click();
        page.getByText("Create Recommendation Request").click();
        assertThat(page.getByText("Create New Recommendation Request")).isVisible();

        page.getByTestId("RecommendationRequestForm-requesterEmail").fill("djensen2@outlook.com");
        page.getByTestId("RecommendationRequestForm-professorEmail").fill("pconrad@ucsb.edu");
        page.getByTestId("RecommendationRequestForm-explanation").fill("masters program");
        page.getByTestId("RecommendationRequestForm-dateRequested").pressSequentially("04260020240808A");
        page.getByTestId("RecommendationRequestForm-dateNeeded").pressSequentially("04270020240808A");
        page.getByTestId("RecommendationRequestForm-done").selectOption("true");
        page.getByTestId("RecommendationRequestForm-submit").click();

        assertThat(page.getByText("Date Needed is required.")).not().isVisible();

        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-requesterEmail")).hasText("djensen2@outlook.com");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-professorEmail")).hasText("pconrad@ucsb.edu");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-explanation")).hasText("masters program");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateRequested")).hasText("2024-04-26T08:08:00");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-dateNeeded")).hasText("2024-04-27T08:08:00");
        assertThat(page.getByTestId("RecommendationRequestTable-cell-row-0-col-Done")).hasText("true");

    }

    @Test
    public void regular_user_cant_create_recrequest() throws Exception{
        setupUser(false);
        page.getByText("Recommendation Requests").click();
        assertThat(page.getByText("Create Recommendation Request")).not().isVisible();
    }
}
