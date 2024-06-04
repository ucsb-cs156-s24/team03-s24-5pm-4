package edu.ucsb.cs156.example.web;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)

public class UCSBDiningCommonsMenuItemsWebIT extends WebTestCase {
    @Test
    public void admin_user_can_create_edit_delete_ucsbdiningcommonsmenuitems() throws Exception {
        setupUser(true);

        page.getByText("UCSB Dining Commons Menu Items ").click();

        page.getByText("Create Menu Item").click();
        assertThat(page.getByText("Create New Dining Commons Menu Item")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-name").fill("Pizza");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-diningCommonsCode").fill("Carillo");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-station").fill("Italian");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-station"))
                .hasText("Italian");

        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Edit-button").click();
        assertThat(page.getByText("Edit UCSB Dining Commons Menu Items")).isVisible();
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-station").fill("Soup");
        page.getByTestId("UCSBDiningCommonsMenuItemsForm-submit").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-station")).hasText("Soup");

        page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-Delete-button").click();

        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemsTable-cell-row-0-col-name")).not().isVisible();
    }

    @Test
    public void regular_user_cannot_create_ucsbdiningcommonsmenuitems() throws Exception {
        setupUser(false);

        page.getByText("UCSB Dining Commons Menu Items").click();

        assertThat(page.getByText("Create Menu Item")).not().isVisible();
        assertThat(page.getByTestId("UCSBDiningCommonsMenuItemTable-cell-row-0-col-name")).not().isVisible();
    }
}