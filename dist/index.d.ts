declare const myLog: (name: string) => {
    message: string;
};
declare function Parsecurl(curlData: any): any;
declare function Makecurl(data: any): string;
export { Parsecurl, Makecurl, myLog };
