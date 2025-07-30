// Server-side Stripe promotion codes debugging script
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
})

async function debugPromotionCodes() {
  console.log("🔍 DEBUGGING PROMOTION CODES FOR STRIPE PAYMENT ELEMENT")
  console.log("============================================================")

  try {
    // 1. Check if we can create a payment intent
    console.log("1️⃣ TESTING PAYMENT INTENT CREATION")
    console.log("----------------------------------------")

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 6900,
      currency: "eur",
      description: "Test Payment Intent for Promotion Code Debug",
      metadata: {
        tempId: "debug-test",
        plan: "trainer-activation",
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
    })

    console.log("✅ Payment Intent created successfully:", paymentIntent.id)
    console.log("   Client Secret exists:", !!paymentIntent.client_secret)

    // 2. List all coupons
    console.log("\n2️⃣ CHECKING EXISTING COUPONS")
    console.log("--------------------------------")

    const coupons = await stripe.coupons.list({ limit: 10 })
    console.log(`Found ${coupons.data.length} coupons:`)

    for (const coupon of coupons.data) {
      console.log(`   📋 Coupon: ${coupon.id}`)
      console.log(`      Valid: ${coupon.valid}`)
      console.log(`      Currency: ${coupon.currency || "any"}`)
      console.log(`      Amount Off: ${coupon.amount_off || "N/A"}`)
      console.log(`      Percent Off: ${coupon.percent_off || "N/A"}`)
      console.log(`      Max Redemptions: ${coupon.max_redemptions || "unlimited"}`)
      console.log(`      Times Redeemed: ${coupon.times_redeemed}`)
    }

    // 3. List all promotion codes
    console.log("\n3️⃣ CHECKING PROMOTION CODES")
    console.log("-------------------------------")

    const promotionCodes = await stripe.promotionCodes.list({ limit: 10 })
    console.log(`Found ${promotionCodes.data.length} promotion codes:`)

    for (const promoCode of promotionCodes.data) {
      console.log(`   🎫 Promotion Code: ${promoCode.code}`)
      console.log(`      Active: ${promoCode.active}`)
      console.log(`      Coupon ID: ${promoCode.coupon.id}`)
      console.log(`      Max Redemptions: ${promoCode.max_redemptions || "unlimited"}`)
      console.log(`      Times Redeemed: ${promoCode.times_redeemed}`)
      console.log(`      Expires At: ${promoCode.expires_at ? new Date(promoCode.expires_at * 1000) : "never"}`)
    }

    // 4. Check specific promotion codes
    console.log("\n4️⃣ CHECKING SPECIFIC PROMOTION CODES")
    console.log("---------------------------------------")

    const codesToCheck = ["JUICEFRIENDS", "ONLYMIRRE", "JUICE10", "WELCOME"]

    for (const code of codesToCheck) {
      try {
        const promoCodeList = await stripe.promotionCodes.list({
          code: code,
          limit: 1,
        })

        if (promoCodeList.data.length > 0) {
          const promoCode = promoCodeList.data[0]
          console.log(`   ✅ ${code}: Found and active=${promoCode.active}`)
          console.log(`      Coupon: ${promoCode.coupon.id}`)
          console.log(`      Valid: ${promoCode.coupon.valid}`)
        } else {
          console.log(`   ❌ ${code}: Not found`)
        }
      } catch (error) {
        console.log(`   ❌ ${code}: Error - ${error.message}`)
      }
    }

    // 5. Account capabilities check
    console.log("\n5️⃣ CHECKING ACCOUNT CAPABILITIES")
    console.log("-----------------------------------")

    try {
      const account = await stripe.accounts.retrieve()
      console.log("Account ID:", account.id)
      console.log("Country:", account.country)
      console.log("Capabilities:", Object.keys(account.capabilities || {}))
    } catch (error) {
      console.log("Could not retrieve account info:", error.message)
    }

    console.log("\n📋 SUMMARY & RECOMMENDATIONS")
    console.log("===============================")

    if (promotionCodes.data.length === 0) {
      console.log("❌ NO PROMOTION CODES FOUND!")
      console.log("   You need to create promotion codes in Stripe Dashboard:")
      console.log("   1. Go to Products > Coupons")
      console.log("   2. Click on a coupon")
      console.log('   3. Click "Create promotion code"')
      console.log("   4. Set the code (e.g., JUICEFRIENDS)")
    } else {
      console.log("✅ Promotion codes exist")
      const activeCodes = promotionCodes.data.filter((pc) => pc.active)
      console.log(`   Active codes: ${activeCodes.length}/${promotionCodes.data.length}`)
    }
  } catch (error) {
    console.error("❌ Debug script failed:", error)
  }
}

// Run the debug function
debugPromotionCodes()
