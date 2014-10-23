caramel
=======

Following have been considered as reserved
------------------------------------------
* components top level directory
* `styles.jag` and `scripts.jag` within `components/*` directories
* These files will be used to add styles and scripts belongs to the components

How to use components
---------------------
* Component can be inserted as `comp('login/basic.jag')` or `comp('login/facebook.jag')`
    * name `comp` was used to give use the feeling of a component
    * `include` cannot be used for this, as we need to differentiate component insertion as we need to add relevant 
    styles and scripts. i.e. `facebook.js` might need it's own local scripts and a `facebook-sdk.js` 

Notes
-----
* HTML output will be initially loaded into memory and then streamed to client
    * Since we need to collect *.js, *.css files of the included components
    * Else, we can ask them to manually include resource inclusion code in the `<head/>` section. But this 
    introduces and extra overhead.
* Get rid of duplicate *.js/*.css file insertion if they were inserted inline








How to handle navigation i.e. List of links are fed from multiple components
    Suggestion: Include common.jag like thing in all the pages
Each component get the

Login/Logout links will have to be handled at app level

When your app needs set of components to be included in each page, you can write an app specific component which
aggregate all the needed components and include it in all your pages. In here, it will be only one component. Hence
the maintenance will be easier.

why styles.jag and scripts.jag >> then you can dynamically generate styles, probably we can first look for styles.jag
and fallback to styles.css



import as a var

