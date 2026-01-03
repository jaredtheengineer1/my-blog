---
title: "Collections"
date: 2026-01-02
tags: [meta, learning]
description: "Collections"
---

## Collections

Collections are homogeneous groups of variables. Boaring. Let's get into some fun.

## Arrays vs Vectors

On the surface I thought these were pretty similar. I wasn't sure why I'd want to pick a vector over an array. I get it now.

To start, there are a couple of ways that we can declare our vector.  Remember, Rust has the macro (singnaled by the `!` at the end of the keyword, like println!...), as well as built in calls like "New".

More often than not, I imagine, we'll be using the macro to declare values right at the start. You can probably do this with the new call, but I don't know and haven't tried it out at the time of this writing. I'll play around with it in my Learning Rust repo when I'm done writing this post.

So I wrote "I get it now" in regards to vectors vs arrays.  Lets get into that.

### Arrays
Arrays are...well...arrays. The thing about them, and this is different from my JavaScript background, is that they are statically sized and don't change.

Wanna break your stuff? Declare an array of size 5, and try pushing 6 things to it. Not gonna work the way you want. It compiles, it allocates memory for 5 elements, it doesn't work anymore.

### Vectors
Vectors, on the other hand, are dynamically sized/allocated.  That means that I can declare it, and then push and pop from it as needed. No having to declare it's size upfront. Very handy.

"Wait, did you say 'pop'?" Yup. Much like a stack, whatever you pushed to the vector last can be `pop()`'d off and accessed. But wait, it also is indexed - so my JavaScript remembering self can always access the 2nd index like `my_vector[2]`. And, it's 0 based indexing - which is correct - so that's the 3rd element on the vector.

### Array or vector?
This just depends on your needs. If you know that you're only ever going to need a certain number of things, go with an array.  

Because I'm a huge nerd, I liken this to an game's inventory system. If your character can only ever hold `X` items, then you don't really need a vector - an array will work because you declare it's size right off the bat.  

If, on the other hand, you could have an unknowable number of things, vector is going to be the right choice for you. My house has a finite amount of space, but my wife is pretty sure she can change that with amazon purchases. This is when you use the vector.

### Things to remember about vectors
Yes, a vector is mutable...if you remember to declare it as such. While a vector can be pushed to, Rust is immutable by default.
Because it's mutable, because it stores it's values in contiguous memory, you need to be careful how you access it
```
  let mut v = vec![1, 2, 3, 4, 5];
  let first = &v[0];
  v.push(6);
  println!("The first element is: {first}");
```
will throw an error. Why? Because you have referenced (`&`) the first index, but by pushing to your vector you might have moved the memory location on the heap.

## Tradeoffs
Because the `array` is statically sized at compile, and the `vector` is dynamic, the array can be stored on the stack while the vector is stored in the heap.

This leads me to believe that the `array` is probably faster and should be preferred when feasible.  That being said, they both store their data in contigous memory so the `vector` *shouldn't* be too slow.

I should note that I have done exactly 0 testing on this, and it's all theory. I'm sure someone out there has run the numbers, and I could look it up, but this sounds close enough for now. As my learning progresses, and I start trying to code actual projects I'll make sure to write some code specifically for benchmarking and I'll talk about the tradeoffs more then