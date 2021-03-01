/**
 * As most of our codes handles error we need to notify the user about them (debugging)
 */
export class Errors{
    static DEBUG_TRUE: boolean = true;

    static throwTypeError(expected: string, actual : string){
        try {
            throw new Error("Expected Type: " + expected + ". Actual Type: " + actual);
        }
        catch (e) {
            console.log(e);
        }
    }

    static throwNullError(ref: any): boolean {
        if (ref == null) {
            try {
                throw new Error("Null reference");
            }
            catch (e) {
                console.log(e);
            }
            return true;
        }
        return false;
    }
}