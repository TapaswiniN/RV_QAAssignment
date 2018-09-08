var expect=require('chai').expect;
var Mocha = require('mocha');
var mocha = new Mocha({
  reporter: 'mochawesome',
  overwrite: true
});

describe('Frontier_TS_01 - TestSuite for HomePage', function() {
  beforeEach(function() {
      //open home page
      browser.url('/');
   });

  it('Frontier_TC_01-Launch Home Page', function(){
    expect(browser.getTitle()).to.have.string('Frontier® Internet Service');
  });

  it('Frontier_TC_02 - Verify Business link on Home Page', function() {
    //Search for Business link on home page and click on first instance
    browser.click('=Business');
    //wait untill business page loads, max wait time is 5sec
    browser.waitUntil(function() {
    return browser.getTitle().startsWith('Business Internet');
  },10000,'Business services page didnot open with in 5 sec',1000);
    expect(browser.getTitle()).to.have.string('Business Internet');
  });

  it('Frontier_TC_03 - Verify MyAccount link on Home page', function() {
    //search for MyAccount link on home page, click on first instance
    browser.click('=My Account');
    //wait untill my account page is loaded, max wait time is 5 sec
    browser.waitUntil(function() {
    return browser.getTitle().startsWith('Sign Into Your Frontier account |');
  },10000,'My account page did not load',1000);
    //validate the title on sign in page
    expect(browser.getTitle()).to.have.string('Sign Into Your Frontier account | Frontier.com');
    // access user name input box
    var userNameElement = $('#fid-login-inline-username');
    var userNameInputType = userNameElement.getAttribute('type');
    // validate the input box type
    expect(userNameInputType).to.equal('text');
    // access password input box
    var passwordElement = $('#fid-login-inline-password');
    var passwordElementType = passwordElement.getAttribute('type');
    //validate the password type
    expect(passwordElementType).to.equal('password');
  });

  it('Frontier_TC_04 - Verify that when hovering over each drop down link a menu appears underneath it', function(){
    // access main menu element
    var mainmenu = $('#menu-primary');
    // get all list element type elements under main menu. This will be collection of list items in order.
    var menuItems = mainmenu.$$('li');
    // first element is 'Plans & Pricing' and get all list element under 'Plans & Pricing''
    var submenuPlans =  menuItems[0].$$('li');
    //Click on 'Plans & Pricing' to show the submenu items
    menuItems[0].click();
    // Validate the links under the submenu items - 'All Plans','Bundles' and 'Frontier FIOS Bundles'
    expect(submenuPlans[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/plans-pricing.html');
    expect(submenuPlans[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/bundles/');
    expect(submenuPlans[2].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/bundles/fios/');
    // second main menu element is 'Internet' and get all list element under 'Internet'.
    // Since menuItems array contains all li items in order, use 4 as index for 'Internet'
    var submenuInternet =  menuItems[4].$$('li');
    //Click on 'Internet' to show the submenu items
    menuItems[4].click();
    // Validate the links under the submenu items - 'High Speed Internet','FiOS Internet' and 'Wireless Services'
    expect(submenuInternet[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/services/');
    expect(submenuInternet[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/fios.html');
    expect(submenuInternet[2].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/services/wireless/');

    // third main menu element is 'TV' and get all list element under 'TV'.
    // Since menuItems array contains all li items in order, use 8 as index for 'TV'
    var submenuTV =  menuItems[8].$$('li');
    //Click on 'TV' to show the submenu items
    menuItems[8].click();
    // Validate the links under the submenu items - 'FiOS TV' and 'Vantage TV'
    expect(submenuTV[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/fios-tv/');
    expect(submenuTV[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/vantage-tv/');
  });

  it('Fontier_TC_05 - Verify Shop Online Button', function () {
    //Identify and click on Shop Online button on home page
    browser.click('#js-track-nav-shop-online');
    // wait until the Shop Online page loads up
    browser.waitUntil(function(){
    return browser.isExisting('h2=Where do you want service?');
    },10000,'Shop Online page did not load with in 10 seconds',1000);
    // Validate if page loaded by trying to access the Header phrase
    expect(browser.getText('h2=Where do you want service?')).to.equal('Where do you want service?');
    //Access the address imput box
    var addressElement = $('#address');
    var addressElementType = addressElement.getAttribute('type');
    //validate the input box type
    expect(addressElementType).to.equal('text');
  });

  it('Fontier_TC_06 - Verify Customer Service Timer on Home Page', function () {
    //get current date
    var errorMarginDate = new Date();
    // for some reason webpage is showing error margin of 2 minutes when compare to my local
    var currentDate = new Date(errorMarginDate.getTime()+(2*60*1000));
    //check for week end. week end hours are different
    var day= currentDate.getDay();
    var remaininghours = 0;
    var remainingMinutes = 0;
    //logic to compute remaing hours and minutes for weekends - day 0 - sunday and day6 is saturday
    if(day == 0 || day == 6)
    {
        var weekendLimitHour = 0;
        // sunday top hour - 9 pm EST - assumption based on my observation
          if(day==0)
          {
            weekendLimitHour = 20;
          }
          else {
            //saturday top hour - 10 pm EST - assumption based on my observation
              weekendLimitHour = 21;
          }
        //get timezone offset in utc to compute weekendlimithour in UTC
        var offsetMinutes =  currentDate.getTimezoneOffset() - 240;
        if(offsetMinutes != 0)
        {
           weekendLimitHour = weekendLimitHour - (offsetMinutes/60);
        }
        //compute the remain hours and minutes
        remaininghours = weekendLimitHour-currentDate.getHours();
        remainingMinutes = 60-currentDate.getMinutes();
    }
    //week day logic
    else
    {
      //compute open hours and minutes
        remaininghours = 23-currentDate.getHours();
        remainingMinutes = 60-currentDate.getMinutes();
    }
    if(remaininghours >= 0)
    {
    //get open hours from UI
    var countDown = $('#countdown');
    //validate the hours and minutes
    var text = countDown.getText();
    expect(text).to.have.string(remaininghours+' Hours '+remainingMinutes+' Minutes');
    }
  });

  it('Fontier_TC_07 - Validate Customer Service Phone Number at multiple places on Home Page', function () {
    //access all the hyperlink tags
    var menuItems = $$('a');
    var telephone = '';
    var count = 0;
    //iterate and access the hyperlink related to customer service number
    menuItems.forEach(function(value){
    if(value.getAttribute('href')!=null && value.getAttribute('href').startsWith('tel:'))
    {

      if(telephone=='')
        {
          //Access first customer care number on home page
          //I have written this logic as i dont have the list of customer care numbers.
          //This can be replaced with valuating against test data
          telephone = value.getAttribute('href').substr(4,10);
        }
      //validate if all the numbers are same on HomePage
      expect(value.getAttribute('href')).to.have.string(telephone);
      count = count+1;
    }
    });
    //validate if one customer care number exist on the page
    expect(telephone).to.not.equal('');
    //validate total count of customer care numbers on all modes
    expect(count).to.equal(7);
  });

  it('Fontier_TC_8 - Verify validation on "Shop Frontier Deals" Button on Home Page without entering Zipcode', function () {
    //scroll to the section of zip code input box
    browser.scroll(0,2000);
    //access the 'shop frontier deals' button
    var button = $('#js-track-form-check-availability');
    //validate the button text
    expect(button.getText()).to.be.oneOf(['Check Availability ›','Shop Frontier Deals ›']);
    // click on button with out entering zip code
    button.click();
    //validate the message
    browser.isExisting("=Address is required.");
  });

  it('Fontier_TC_9 - Verify Shop Internet, Shop TV, Shop Phone, Bundles Button on Home Page', function () {
     //scroll to the shop widgets section
     browser.scroll(0,1400);
     //click on 'Shop Internet' link
     browser.click('#js-track-home-shop-internet');
     //wait until internet deals page opens up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier® | Local Internet Service Provider | New Customer Deals!');
     },10000,'Shop Internet page did not open with in 5 sec',1000);
     //validate the title on Interenet services page
     expect(browser.getTitle()).to.have.string('Frontier® | Local Internet Service Provider | New Customer Deals!');
     // click on logo hyperlink to go back to home page
     browser.click('#js-track-logo');
     //wait until home page loads up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier® Internet Service');
     },10000,'Home page did not open with in 5 sec',1000);

     //click on 'Shop TV' link
     browser.click('#js-track-home-shop-tv');
     //wait until TV deals page opens up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier FiOS TV |');
     },10000,'Shop TV page did not open with in 5 sec',1000);
     //validate the title on TV services page
     expect(browser.getTitle()).to.have.string('Frontier FiOS TV |');
     // click on logo hyperlink to go back to home page
     browser.click('#js-track-logo');
     //wait until home page loads up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier® Internet Service');
     },10000,'Home page did not open with in 5 sec',1000);

     //click on 'Shop Phone' link
     browser.click('#js-track-home-shop-plans');
     //wait until Phone deals page opens up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier Phone Service |');
     },10000,'Shop Phone page did not open with in 5 sec',1000);
     //validate the title on Phone services page
     expect(browser.getTitle()).to.have.string('Frontier Phone Service |');
     // click on logo hyperlink to go back to home page
     browser.click('#js-track-logo');
     //wait until home page loads up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier® Internet Service');
     },10000,'Home page did not open with in 5 sec',1000);

     //click on 'Shop Bundles' link
     browser.click('#js-track-home-shop-bundles');
     //wait until BUNDLE deals page opens up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier Bundles |');
     },10000,'Shop Bundles page did not open with in 5 sec',1000);
     //validate the title on bundles page
     expect(browser.getTitle()).to.have.string('Frontier Bundles |');
     // click on logo hyperlink to go back to home page
     browser.click('#js-track-logo');
     //wait until home page loads up
     browser.waitUntil(function(){
         return browser.getTitle().startsWith('Frontier® Internet Service');
     },10000,'Home page did not open with in 5 sec',1000);
     expect(browser.getTitle()).to.have.string('Frontier® Internet Service');
   });

  it('Frontier_TC_10-Verify footer links under Services, Bundles and Save,Explore Frontier', function() {
    // access footer menu element
    var mainmenu = $('#menu-footer');
    //get all list items under footer menu
    var menuItems = mainmenu.$$('li');
    //get list items under Services
    var footerservices =  menuItems[0].$$('li');
    //validate the links for 'Frontier FiOS Services','High Speed Internet','Vantage Services' and 'DSL Internet Services'
    expect(footerservices[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/fios.html');
    expect(footerservices[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/services/high-speed/');
    expect(footerservices[2].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/vantage-internet/');
    expect(footerservices[3].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/services/dsl/');
    //get list items under 'Bundle & Save'
    var footerbundlesandsave =  menuItems[5].$$('li');
    //validate the links for 'Frontier Bundles','Internet and Phone Bundles','TV and Internet Bundles' and 'Frontier Deals'
    expect(footerbundlesandsave[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/bundles/');
    expect(footerbundlesandsave[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/bundles/tv-internet/');
    expect(footerbundlesandsave[2].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/bundles/internet-phone/');
    expect(footerbundlesandsave[3].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/deals/');

    //get list items under 'Explore Frontier'
    var exlorefrontier =  menuItems[10].$$('li');
    //validate the links for 'Resources','Espanol','Existing Customers' and 'Frontier In My Area'
    expect(exlorefrontier[0].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/resources/');
    expect(exlorefrontier[1].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/espanol/');
    expect(exlorefrontier[2].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/existing-customers.html');
    expect(exlorefrontier[3].$('a').getAttribute('href')).to.be.equal('https://internet.frontier.com/availability/');
  });

});
