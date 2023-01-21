package appium_Testscript;

import org.testng.annotations.Test;

import appium_mobile.Base2;
import appium_page_factory.Addtocart;
import appium_page_factory.Detail_Page_Firstscreen;

public class TC1 extends Base2
{
	//TC1 is add two product in the cart
		@Test
		 public void firstscreen() throws InterruptedException
		 {
			Detail_Page_Firstscreen pf=new Detail_Page_Firstscreen(driver);
			pf.execute("karishma", "Argentina", "Female");
			
			Addtocart ad=new Addtocart(driver);
			ad.execute1();
		 }

	

}
