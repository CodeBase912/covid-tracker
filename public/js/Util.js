export function formatNumber(number) {

    /**About

     * @function formatNumber
       - This functions takes in an integer to format into the following: number: 1234567 -> result: 1 234 567

     * Input-Variables:
       > @param {integer} number
        - This variable is the number to format.

     * Output-Variables:
       > @param {string} result
        - This variable is the formatted number.


    */

    let string = [];
    for (let i = number.toString().length; i >= 0; i-=3){ 
        if (i < 3) {
            string.unshift(number.toString().slice(0, i));
        }
        else{
            string.unshift(number.toString().slice(i-3, i));
        } 
    }
    const result = string.join(" ");
    return result;
}