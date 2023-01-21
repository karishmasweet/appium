package appium_Testscript;

import org.openqa.selenium.By;
import org.testng.Assert;
import org.testng.annotations.Test;

import appium_mobile.Base2;
import appium_page_factory.Addtocart;
import appium_page_factory.Chrome_launch;
import appium_page_factory.Detail_Page_Firstscreen;

public class TC3 extends Base2
{
	@Test
	public void secondscreen() throws InterruptedException
	 {
		Detail_Page_Firstscreen pf=new Detail_Page_Firstscreen(driver);
		pf.execute("karishma", "Argentina", "Female");
		
		Addtocart ad=new Addtocart(driver);
		ad.execute1();
		
		Thread.sleep(5000);
        String shoes1_amount1=driver.findElements(By.id("com.androidsample.generalstore:id/productPrice")).get(0).getText();
        //$160.97, it will remove the dollar sign from index [0]
        //it is story the same variable because we want integer value
        //still it is storing into string so that we have to convert into integer but it is not numeric value it is taking some decimal
        //values for that we take double
        shoes1_amount1=shoes1_amount1.substring(1);
        //out above will be 160.97
        
        //we are taking double values, convert string into number values but these number are double not integer
        //thats why we are taking double
        double amount1=Double.parseDouble(shoes1_amount1);
        
        String shoes2_amount2=driver.findElements(By.id("com.androidsample.generalstore:id/productPrice")).get(1).getText();
        
        shoes2_amount2=shoes2_amount2.substring(1);
        double amount2=Double.parseDouble(shoes2_amount2);
       
        double sumofproduct=amount1+amount2;
        System.out.println("sum of product "+sumofproduct);
        
        
        String total=driver.findElement(By.id("com.androidsample.generalstore:id/totalAmountLbl")).getText();
        total=total.substring(1);
        
      //converting string into double data type
        Double totalvalue=Double.parseDouble(total);
        System.out.println("Total value of product "+totalvalue);
        
        Assert.assertEquals(sumofproduct, totalvalue);
		
	 }

}
