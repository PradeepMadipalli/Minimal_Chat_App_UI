import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
    name:'messageFilter'
})
export class MessageFilterPipe implements PipeTransform {
    transform(meassges: any[], searchvalueus: string) :any[]{
        if (!meassges || !searchvalueus) {
            return meassges;
        }
        return meassges.filter(mess => mess.content.toLowerCase().indexOf(searchvalueus.toLocaleLowerCase()) !== -1);
    }
}