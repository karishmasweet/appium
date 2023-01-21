package appium_mobile;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.Test;

import io.appium.java_client.AppiumBy;

public class compare_price extends Base2
{
	@Test
	public void testcase() throws InterruptedException
	{
		Thread.sleep(4000);
		driver.findElement(By.id("com.androidsample.generalstore:id/nameField")).sendKeys("Karishma");
		driver.hideKeyboard();
		driver.findElement(By.xpath("//android.widget.RadioButton[@text='Female']")).click();
		driver.findElement(By.id("android:id/text1")).click();
		driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\"Argentina\"));"));
		driver.findElement(By.xpath("//android.widget.TextView[@text='Argentina']")).click();
		driver.findElement(By.id("com.androidsample.generalstore:id/btnLetsShop")).click();
		Thread.sleep(4000);
		//xpath name(Tagname[@text='ADD TO CART'])
        driver.findElements(By.xpath("//android.widget.TextView[@text='ADD TO CART']")).get(0).click();
        driver.findElements(By.xpath("//android.widget.TextView[@text='ADD TO CART']")).get(0).click();
        driver.findElement(By.id("com.androidsample.generalstore:id/appbar_btn_cart")).click();
        
        Thread.sleep(5000);
          String shoes1_amount1=driver.findElements(By.id("com.androidsample.generalstore:id/productPrice")).get(0).getText();
          //$160.97, it will remove the dollar sign from index [0]
          //it is story the same variable because we want integer value
          //still it is storing into string so that we have to convert into integer but it is not numeric value it is taking some decimal
          //values for that we take double
          shoes1_amount1=shoes1_amount1.substring(1);
          //out above will be 160.97
          
          //we are taking double values, convert string into number values but these number double not integer
          double amount1=Double.parseDouble(shoes1_amount1);
          
          String shoes2_amount2=driver.findElements(By.id("com.androidsample.generalstore:id/productPrice")).get(1).getText();
          
          shoes2_amount2=shoes2_amount2.substring(1);
          double amount2=Double.parseDouble(shoes2_amount2);
         
          double sumofproduct=amount1+amount2;
          System.out.println(sumofproduct + "sum of product");
          
          
          String total=driver.findElement(By.id("com.androidsample.generalstore:id/totalAmountLbl")).getText();
          total=total.substring(1);
          
        //converting string into double data type
          Double totalvalue=Double.parseDouble(total);
          System.out.println(totalvalue + "Total value of product");
          
          Assert.assertEquals(sumofproduct, totalvalue);
          
        
        
        
        
	}

}
