package appium_page_factory;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

import io.appium.java_client.AppiumBy;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.pagefactory.AppiumFieldDecorator;

public class Detail_Page_Firstscreen 
{
AndroidDriver driver; 

	
	@FindBy(id="com.androidsample.generalstore:id/nameField")
	private WebElement name;
	
	@FindBy(xpath="//android.widget.RadioButton[@text='Female']")
	private WebElement female;
	
	@FindBy(xpath="//android.widget.RadioButton[@text='Male']")
	private WebElement male;
	
	@FindBy(id="android:id/text1")
	private WebElement Country_dropdown;
	
	@FindBy(id="com.androidsample.generalstore:id/btnLetsShop")
	private WebElement continue_btn;

	public Detail_Page_Firstscreen(AndroidDriver driver)
	{
		this.driver =  driver;
	PageFactory.initElements(new AppiumFieldDecorator(driver), this);
		
	}
	
	public void execute(String Nam, String Country, String gender) throws InterruptedException
	{
		Thread.sleep(4000);
		
		name.sendKeys(Nam);
		driver.hideKeyboard();
		
		if(gender.equalsIgnoreCase("Male"))
		{
			male.click();	
		}
		if(gender.equalsIgnoreCase("Female"))
		{
			female.click();
		}
		
		Country_dropdown.click();
		driver.findElement(AppiumBy.androidUIAutomator("new UiScrollable(new UiSelector()).scrollIntoView(text(\""+Country+"\"));")).click();
	//	driver.findElement(By.xpath("//android.widget.TextView[@text='Argentina']")).click();
		continue_btn.click();
	}
}

