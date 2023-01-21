package appium_mobile;

import org.openqa.selenium.By;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumBy;

public class add_to_card extends Base2
{

	@Test
	public void testcase9() throws InterruptedException
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
		//scrolling upto Jordan 6 Rings
		driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\"Jordan 6 Rings\"));"));
	
		int count=driver.findElements(By.id("com.androidsample.generalstore:id/productName")).size();
		for(int i=0;i<count;i=i+1)
		{
			String productName=driver.findElements(By.id("com.androidsample.generalstore:id/productName")).get(i).getText();
			if(productName.equals("Jordan 6 Rings"))
			{
				driver.findElements(By.id("com.androidsample.generalstore:id/productAddCart")).get(i).click();
			}
		}
		driver.findElement(By.id("com.androidsample.generalstore:id/appbar_btn_cart")).click();
	}

}
