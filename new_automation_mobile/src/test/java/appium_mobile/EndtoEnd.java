package appium_mobile;

import org.openqa.selenium.By;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumBy;

public class EndtoEnd extends Base2

{
	@Test
	public void testcase8() throws InterruptedException
	{
		Thread.sleep(4000);
		driver.findElement(By.id("com.androidsample.generalstore:id/nameField")).sendKeys("karishma");
		//hidden the keyboard
		driver.hideKeyboard();
		
		//xpath name(Tagname[@text='Female'])
		driver.findElement(By.xpath("//android.widget.RadioButton[@text='Female']")).click();
		driver.findElement(By.id("android:id/text1")).click();
		//scrolling 
		driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\"Argentina\"));"));
		//xpathname(tagname[@text='argentina'])
		driver.findElement(By.xpath("//android.widget.TextView[@text='Argentina']")).click();
		//click on letshop button
		driver.findElement(By.id("com.androidsample.generalstore:id/btnLetsShop")).click();
	}

}
