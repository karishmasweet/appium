package appium_mobile;

import java.net.MalformedURLException;

import org.openqa.selenium.By;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumBy;

public class clippboard extends Base
{

	@Test
	public void testcase7() throws MalformedURLException, InterruptedException
	{

        driver.findElement(AppiumBy.accessibilityId("Preference")).click();
        driver.findElement(AppiumBy.accessibilityId("3. Preference dependencies")).click();
        
        driver.findElement(By.id("android:id/checkbox")).click();
        driver.findElement(By.xpath("(//android.widget.RelativeLayout)[2]")).click();
        driver.setClipboardText("Deep@nshu97");
        driver.findElement(By.id("android:id/edit")).sendKeys(driver.getClipboardText());
}
}