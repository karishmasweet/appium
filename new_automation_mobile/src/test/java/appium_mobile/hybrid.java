package appium_mobile;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.nativekey.AndroidKey;
import io.appium.java_client.android.nativekey.KeyEvent;

public class hybrid extends Base2
{
	@Test
	public void testcase() throws InterruptedException
	{
		Thread.sleep(4000);
		driver.findElement(By.id("com.androidsample.generalstore:id/nameField")).sendKeys("Deepak");
		driver.hideKeyboard();
		driver.findElement(By.xpath("//android.widget.RadioButton[@text='Female']")).click();
		driver.findElement(By.id("android:id/text1")).click();
		driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\"Argentina\"));"));
		driver.findElement(By.xpath("//android.widget.TextView[@text='Argentina']")).click();
		driver.findElement(By.id("com.androidsample.generalstore:id/btnLetsShop")).click();
		Thread.sleep(4000);
        driver.findElements(By.xpath("//android.widget.TextView[@text='ADD TO CART']")).get(0).click();
        driver.findElement(By.id("com.androidsample.generalstore:id/appbar_btn_cart")).click();
        Thread.sleep(5000);
       // driver.findElement(AppiumBy.className("android.widget.CheckBox")).click();
        driver.findElement(By.id("com.androidsample.generalstore:id/btnProceed")).click();
        Thread.sleep(5000);
       /* Set<String> contexts=driver.getContextHandles();
        for(String s : contexts)
        {
        	System.out.println(s);
        }*/
        driver.context("WEBVIEW_com.androidsample.generalstore");
        
        //it is xpath which is given by web
        driver.findElement(By.name("q")).sendKeys("DT Hub");
        Thread.sleep(3000);
        driver.findElement(By.name("q")).sendKeys(Keys.ENTER);
        driver.pressKey(new KeyEvent(AndroidKey.BACK));
        //back to app, this code is for switching to app
        driver.context("NATIVE_APP");
       
        
	}

}
