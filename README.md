#jQuery MyTour

Mytour is a jQuery plugin that provides an easy and lightweight way to create an enjoyable virtual tour for your site. It's so fast and so easy to setup that you can do it in a few minutes without too much effort!

Have you ever though into create a virtual tour for visitants of your website? 
With a tour you can guide people who access your site across the main information or funcionalities! Isn't cool?

##Details

Since you're using MyTour plugin you can expect:

> - An easy way to implement a virtual tour;
> - Totally customizable;

##How to use it

Import "jquery.mytour.1.0.5.js" on the HEAD of your page:

```
<link rel="stylesheet" type="text/css" href="jquery.mytour.css" />
<script type="text/javascript" src="jquery.mytour.1.0.5.min.js" ></script>
```

Set all steps of your tour.

Your steps should be placed into an unordered list.

The container of steps (ul) might be stylized with `"display: none;"`, and you can place your steps in five different positions (top, right, bottom, left and none) related to the object. The `none` position is used when you'd like to show an introduction without point it on any object on screen.

```
<!-- TOUR CONTENT -->
<ul id="my-tour-steps" style="display: none;">
  <li data-id="#element-id-1" data-position="none" >
    <!-- PUT ALL YOUR STUFF HERE -->
    <!-- POSITION 'NONE' CAN BE USED TO INTRODUCE YOUR APPLICATION -->
  </li>
  <li data-id="#element-id-1" data-position="bottom" >
    <!-- PUT ALL YOUR STUFF HERE -->
  </li>
  <li data-id="#element-id-2" data-position="top" >
    <!-- PUT ALL YOUR STUFF HERE -->
  </li>
  <li data-id="#element-id-3" data-position="left" >
    <!-- PUT ALL YOUR STUFF HERE -->
  </li>
  <li data-id="#element-id-1" data-position="right" >
    <!-- PUT ALL YOUR STUFF HERE -->
  </li>
</ul>
```

Then, you just need to call it:

```
<link rel="stylesheet" type="text/css" href="jquery.mytour.css" />
<script type="text/javascript" src="jquery.mytour.1.0.5.min.js" >
    jQuery(document).ready(function(){
       $('#trigger').mytour();
    });
</script>
```

Done! Isn't cool?

##What'll happend

That's ok! It's too much easy, but what will happend after?

When you click on the trigger element, the tour will starts. Also there is an option to play it automaticaly.

For each li that you set on "my-tour-steps", a balloon will be showed with your stuff. The viewer can control which step s/he wanna goes thru and can goes backward or forward anytime.

---

that's it! Easy, don't you?

If you have any suggestion, critics or just wanna say hello, feel free to mail me or leave a comments here. 

I'll certainly answer as soon as I can.

Happy coding! =)
