
const PARALLEL_DISPLAY_NAMES = new Map<string, string>([
    // Sapphire
    ['Aqua Sapphire', 'Aqua'],
    ['70th Anniversary Sapphire', '70th Sapphire'],
    ['Gold Sapphire', 'Gold'],
    ['Orange Sapphire', 'Orange'],
    ['Purple Sapphire', 'Purple'],
    ['Red Sapphire', 'Red'],
    ['Chartreuse Sapphire', 'Chartreuse'],
    ['Sepia Sapphire', 'Sepia'],
    ['Green Sapphire', 'Green'],

    // Refractors
    ['Purple/Green Refractor', 'Purple/Green'],
    ['Gold/Purple Refractor', 'Gold/Purple'],
    ['Orange/Red Refractor', 'Orange/Red'],
    ['Red/Green Refractor', 'Red/Green'],
    ['Purple Refractor', 'Purple'],
    ['Purple Checker Flag Refractor', 'Purple Checker'],
    ['Green Refractor', 'Green'],
    ['Gold Refractor', 'Gold'],
    ['70th Anniversary Gold Refractor', '70th Gold'],
    ['Gold Checker Flag Refractor', 'Gold Checker'],
    ['Gold Wave Refractor', 'Gold Wave'],
    ['Orange Refractor', 'Orange'],
    ['70th Anniversary Orange Refractor', '70th Orange'],
    ['Orange Checker Flag Refractor', 'Orange Checker'],
    ['Orange Wave Refractor', 'Orange Wave'],
    ['Red Refractor', 'Red'],
    ['70th Anniversary Red Refractor', '70th Red'],
    ['Red Checker Flag Refractor', 'Red Checker'],
    ['Red Wave Refractor', 'Red Wave'],
    ['Green RayWave Refractor', 'Green RayWave'],
    ['Pink Refractor', 'Pink'],
    ['Pink RayWave Refractor', 'Pink RayWave'],
    ['Aqua Wave Refractor', 'Aqua Wave'],
    ['Fuchsia Lava Refractor', 'Fuchsia Lava'],
    ['Mini Diamond Refractor', 'Mini Diamond'],
    ['Black and White RayWave Refractor', 'B&W RayWave'],
    ['Sepia Refractor', 'Sepia'],
    ['Gold RayWave Refractor', 'Gold RayWave'],
    ['Orange RayWave Refractor', 'Orange RayWave'],
    ['Red RayWave Refractor', 'Red RayWave'],
    ['Black RayWave Refractor', 'Black RayWave'],
    ['Blue Refractor', 'Blue'],
    ['Pearl White Refractor', 'Pearl White'],
    ['Gold Minted Refractor', 'Gold Minted'],

    // X-Fractors
    ['Checkered Flag Gold X-fractor', 'Gold X-fractor'],
    ['Checkered Flag Orange X-fractor', 'Orange X-fractor'],
    ['Checkered Flag Red X-fractor', 'Red X-fractor'],

    // Foils & Patterns
    ['Checker Flag', 'Checker'],
    ['Sparkle Foil', 'Sparkle'],
    ['Rainbow Foil', 'Rainbow'],
    ['Red Foil', 'Red'],
    ['Black Foil', 'Black'],
    ['Black and White Foil', 'B & W'],
    ['Purple Foil', 'Purple'],
    ['Blue Foil', 'Blue'],
    ['Rainbow Foilboard', 'Rainbow'],
    ['Gold Rainbow Foil', 'Gold Rainbow'],

    // Printing Plates
    ['Printing Plate Black', 'Black Plate'],
    ['Printing Plate Cyan', 'Cyan Plate'],
    ['Printing Plate Magenta', 'Magenta Plate'],
    ['Printing Plate Yellow', 'Yellow Plate'],

    // Autos
    ['Red Autograph', 'Red Auto'],
    ['Black Autograph', 'Black Auto'],
    ['Rainbow Autograph', 'Rainbow Auto'],
    ['Green Autograph', 'Green Auto'],
    ['Gold Rainbow Autograph', 'Gold Rainbow Auto'],
    ['Gold Autograph Refractor', 'Gold Auto'],
    ['Black Autograph Refractor', 'Black Auto'],
    ['Red Autograph Refractor', 'Red Auto'],

    // Inserts
    ['Insert Die-Cut Refractor', 'Die-Cut'],
    ['Insert Gold Refractor', 'Gold'],
    ['Insert Black Refractor', 'Black'],
    ['Insert Red Refractor', 'Red'],

    // Logofractor
    ['Green Logofractor', 'Green'],
    ['Gold Logofractor', 'Gold'],
    ['Orange Logofractor', 'Orange'],
    ['Black Logofractor', 'Black'],
    ['Red Logofractor', 'Red'],

    // FINEST
    // Common
    ['Common Blue Refractor', 'Blue'],
    ['Common Die-Cut Refractor', 'Die-Cut'],
    ['Common Gold Refractor', 'Gold'],
    ['Common Black Refractor', 'Black'],
    ['Common Red/Black Vapor Refractor', 'Red/Black'],
    ['Common Red Refractor', 'Red'],

    // Uncommon
    ['Uncommon Blue Refractor', 'Blue'],
    ['Uncommon Die-Cut Refractor', 'Die-Cut'],
    ['Uncommon Gold Refractor', 'Gold'],
    ['Uncommon Black Refractor', 'Black'],
    ['Uncommon Red/Black Vapor Refractor', 'Red/Black'],
    ['Uncommon Red Refractor', 'Red'],

    // Rare
    ['Rare Blue Refractor', 'Blue'],
    ['Rare Die-Cut Refractor', 'Die-Cut'],
    ['Rare Gold Refractor', 'Gold'],
    ['Rare Black Refractor', 'Black'],
    ['Rare Red/Black Vapor Refractor', 'Red/Black'],
    ['Rare Red Refractor', 'Red'],
    // END OF FINEST

    // Rare 1/1s
    ['70th Anniversary Superfractor', '70th Superfractor'],
    ['Rose Gold Logofractor', 'Rose Gold'],
])

const getParallelDisplayName = (parallel: string) => PARALLEL_DISPLAY_NAMES.get(parallel) ?? parallel

export const ParallelUtils = {
    getParallelDisplayName
}