package appium_mobile;

import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

public class Toastmessage extends Base2

{
	@Test
	public void testcase8() throws InterruptedException
	{
		Thread.sleep(4000);
		

		driver.findElement(By.id("com.androidsample.generalstore:id/btnLetsShop")).click();
		//This is code for tostmessage(xpath("(//android.widget.Toast)[1]"))
		String toastmsg=driver.findElement(By.xpath("(//android.widget.Toast)[1]")).getAttribute("name");
		System.out.println("toastmsg is "+toastmsg);
		Assert.assertEquals(toastmsg,"Please enter your name");
	}
	

}
