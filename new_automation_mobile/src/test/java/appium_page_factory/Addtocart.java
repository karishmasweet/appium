package appium_page_factory;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;

public class Addtocart 
{
	AndroidDriver driver; 
	
	@FindBy(xpath="//android.widget.TextView[@text='ADD TO CART']")
	private WebElement fistproduct;
	
	@FindBy(xpath="//android.widget.TextView[@text='ADD TO CART']")
	private WebElement secondproduct;
	
	@FindBy(id="com.androidsample.generalstore:id/appbar_btn_cart")
	private WebElement cardmenu;
	
	public Addtocart(AndroidDriver driver)
	{
		this.driver =  driver;
	PageFactory.initElements(new AppiumFieldDecorator(driver), this);
		
	}
	
	public void execute1() throws InterruptedException
	{
		Thread.sleep(4000);
		fistproduct.click();
		secondproduct.click();
		cardmenu.click();
		
		
		
	}
}
