# jscroot
JSCroot Skeleton, copy jscroot folder to your web. JSCroot consist four main folder with one index.js in root folder. There are:
1. index.js file : to run JSCroot skeleton properly 
2. controller : As handler to control action in main html
3. url : Like router or routing between template and view
4. template : html structured folder called by url
5. view : javascript structured folder use by template

## Slicing HTML and JS
To use existing template, steps are: 
1. Split index.html into template folder
2. Set same structure with template in view folder
3. every js file in view, create _export function main()_ to run js for html content.
    ```js
    export function main(){
        yourscript(js);
    }
    ```
