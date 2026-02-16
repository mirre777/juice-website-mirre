import { put } from "@vercel/blob"

const interviewContent = `---
title: "PT Spotlight: Lena from Strength Lab Vienna — From Brain to Barbell"
excerpt: "In our latest Juice PT Spotlight, we talk to Lena from Strength Lab Vienna about how she went from brain-focused to body-strong, why resistance training is non-negotiable, and what most trainers underestimate about their clients."
author: "Juice Team"
date: "2025-01-06"
category: "Interview"
tags: ["Dynamic"]
trainer: "Lena from Strength Lab Vienna"
image: "/personal-trainer-coaching-client-in-modern-gym.jpg"
readTime: 8
featured: true
---

In our latest Juice PT Spotlight, we talk to Lena from Strength Lab Vienna about how she went from brain-focused to body-strong, why resistance training is non-negotiable, and what most trainers underestimate about their clients.

## What first made you want to coach people? Was there a specific turning point or frustration that pushed you into it?

**Lena:**

I started coaching because I became obsessed with weightlifting myself. For most of my life, I was very brain-focused and kind of neglected my body. It was just a vessel for my mind.

Over time, I realized how deeply our thinking is embedded in the body — and how important it is to live in a strong, healthy one. Now I can't imagine it being otherwise.

Because I'm quite research-driven, I dove deep into the science behind training. I'd spend hours each week reading studies on hypertrophy, recovery, and programming. After a while, I naturally started training friends. Eventually, I decided to get certified and turn it into my profession.

If my origin story were a headline, it would be something like: "From brain in a vat to embodied thinker."

## What's something you believed early on about training that now makes you laugh?

**Lena:**

I used to think that training was optional — something "nice to have" if you happen to enjoy it.

Now I see resistance training as fundamental to a high-quality life. Muscle mass naturally declines with age, and the only way to fight that is to use it and train it.

It's not about flashy supplements or longevity hacks. It's the basics: sleep well, manage stress, and lift heavy weights. That's what truly supports aging well.

## Looking back, what did you totally underestimate about being a personal trainer?

**Lena:**

Scheduling chaos. One flaky client can take up more time than three consistent ones.

I definitely underestimated how much mental energy goes into the logistics side of the job.

## Who's the exact person you help best? Picture one client and describe them.

**Lena:**

The people I help best are those who've realized that resistance training isn't optional anymore — they want to make it a consistent part of their lives.

I especially love training people in their 60s and 70s. That's where you can make truly dramatic changes. Someone at that age can still gain a lot of muscle and independence through strength training. It completely changes how they move in the world.

## What do you think most coaches get wrong about helping those clients?

**Lena:**

A lot of coaches set the bar too low. Older clients—or women who don't come in with an athlete mindset—are often treated as if they're fragile. But they're capable of much more than most realize. If you treat people like athletes, they start acting and performing like athletes.

## What's your signature move or principle that your clients often quote back to you?

**Lena:**

I'm very passionate about the science behind weightlifting, so my sessions often turn into friendly debates about research. I'll bring up new studies, or times when I've changed my mind about something. My clients end up learning the why behind what they do, and that makes training a lot more engaging. So I guess my "signature move" is talking about evidence while people are under a barbell.

## What's something you stopped doing that immediately made your clients better?

**Lena:**

I stopped using spreadsheets.

I used to send clients Google Sheets to log their workouts. Now, I use the Juice app. It lets them track progress directly in a clean, structured way — no awkward scrolling in the middle of a workout.

It's just a better experience for them, and I can still design my programs in spreadsheets behind the scenes. It was a small switch that made a big difference.

## If you could give advice to yourself as a brand-new trainer, what would it be?

**Lena:**

Start building your social presence earlier.

I'm not naturally someone who likes self-promotion or brand building, but it's a crucial part of helping people discover you. Word of mouth is great, but if you want to reach those who aren't already convinced about strength training, you need to show up where they are — and that means being visible online.

## What's one popular belief or trend in fitness you think is flat-out wrong—and what should replace it?

**Lena:**

The whole conversation around dieting is too black and white.

Some people act like it's purely a matter of willpower; others say it's all biology. The truth sits in the middle. People have different biological setups, drives, and histories — so what's easy for one person can be incredibly hard for another.

We need to talk about it with more nuance and less judgment.

## If every potential client read one sentence from this interview, what would you want it to be?

**Lena:**

"Strength isn't a hobby — it's the foundation for living well in your body, at any age."

---

**Find Lena at:** [Strength Lab Vienna](https://strengthlabvienna.com)

**Want to be featured in our next PT Spotlight?** Apply via crew@juice.fitness
`

async function uploadInterview() {
  try {
    console.log("[v0] Starting interview upload...")

    const blob = await put("interviews/lena-strength-lab-vienna.md", interviewContent, {
      access: "public",
      addRandomSuffix: false,
    })

    console.log("[v0] Interview uploaded successfully!")
    console.log("[v0] Blob URL:", blob.url)
    console.log("[v0] Interview will be available at: /interview/lena-strength-lab-vienna")

    return blob
  } catch (error) {
    console.error("[v0] Error uploading interview:", error)
    throw error
  }
}

uploadInterview()
