package appium_page_factory;

import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.android.nativekey.KeyEvent;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;

public class Chrome_launch 
{
	AndroidDriver driver; 
	
	@FindBy(id="com.androidsample.generalstore:id/btnProceed")
	private WebElement proceedbutton;
	
	@FindBy(name="q")
	private WebElement q;
	
	
	
	public Chrome_launch(AndroidDriver driver)
	{
		this.driver =  driver;
	PageFactory.initElements(new AppiumFieldDecorator(driver), this);
		
	}
	
	public void execute2() throws InterruptedException
	{
		Thread.sleep(500);
		proceedbutton.click();
		Thread.sleep(5000);
		driver.context("WEBVIEW_com.androidsample.generalstore");
		q.sendKeys("DT Hub");
		Thread.sleep(3000);
		q.sendKeys(Keys.ENTER);
		driver.pressKey(new KeyEvent(AndroidKey.BACK));
        //back to app, this code is for switching to app
        driver.context("NATIVE_APP");
		
		
		
		
		
	}

}
