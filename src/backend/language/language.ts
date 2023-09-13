import {Alphabet, Modify, Promote} from '../alphabet/alphabet';
import {MergeUnion} from '../utils/typetools';
import {underlying} from '../alphabet/layers/underlying/underlying';
import {templated} from '../alphabet/layers/templated/templated';

type ZipWithNext<Arr extends ReadonlyArray<unknown>> =
  Arr extends readonly [infer Head extends Arr[number], ...infer Tail]
    ? readonly [Head, Tail[0]] | ZipWithNext<Tail>
    : never;

export const language = <
  const ABCs extends ReadonlyArray<Alphabet>,
  const Libraries extends {
    [Pair in ZipWithNext<ABCs> as Pair[0][`name`]]: MergeUnion<
      | {modify: {[T in keyof Pair[0][`types`]]: Modify<T, Pair[0]>}}
      | (Pair[1] extends undefined ? never : {
        promote: {
          [T in keyof Pair[0][`types`]]: Promote<T, Pair[0], Pair[1] & Alphabet>
        }
      })
    >
  },
>(abcs: ABCs, libraries: Libraries): {
  modify: {[ABC in ABCs[number] as ABC[`name`]]: ABC}
} => ({}) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

const wat = language([templated, underlying],
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    templated: {modify: {} as any, promote: {} as any},
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    underlying: {modify: {} as any},
  }
);//.modify.;

/*
I get it (update: nvm this is still missing something I'm just not sure what -- think about .dropIn()...)

There will be three stages of transform declarations
The first stage is just the input->output library that feeds the second stage, these are for convenience as you see fit but they don't ultimately
matter to the overall model

The second stage is transforms based only on the object itself: type, features, and context
You DO NOT complect the second stage with stuff from the environment
This way you can define eg your easy pronoun categories in the second stage, split them up by type (prefix suffix enclitic standalone etc etc etc)
And again the second stage can use functions defined in the library for convenience
idk if this stuff terminates on another second-stage key or on eg a library function... no that doesn't make sense, it has to terminate on another second-stage key

Finally the third stage takes transforms defined in the second stage and puts them in context with different environments
There will be a library of environments too so you don't have to write everything from scratch, I'm thinking this library should be defined as close
to the third stage as possible so you can see it easily instead of my original idea of defining it way back in the call to alphabet(), I think
features/context/traits are good enough
The third stage should also define probabilities I think, I'll have to see how to integrate this with the second stage (maybe cross bridge when get to it)

Lastly, on file structure: I think ultimately there should be a function like alphabet() for each part of this
Namely, a library() 'constructor' should exist separately from alphabet.modify() and alphabet.promote()
You should be able to define a library in one file then import it into multiple other files for different accents' second stages?
I think that's how it could work?
And the third stage will be methods of language(), like how alphabet().modify() and alphabet().promote() are defined

The ultimate goal is probably to have each accent constrained to its own folder although idk how imports for deriving from these stages will work 100% yet
That's okay -- work on getting this up to scratch
Man
*/
