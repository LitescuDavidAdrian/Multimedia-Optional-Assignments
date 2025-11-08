Exercises

Complete the following exercises to create a dynamic, functional music library. A JSON file (library.json) containing 9 albums with artist names, album titles, thumbnails, and tracklists has been provided for these exercises.

    1. Load and display albums dynamically: Remove all hardcoded cards from the HTML. Use JavaScript to fetch the library.json file and dynamically generate cards for each album. Each card should display:
        The album's thumbnail image (from assets/img/{thumbnail})
        The artist name as the card title
        The album name as the card text
        A "View Tracklist" button
        Use a card footer instead of the <hr> tag
        Find a way to ensure the same height for all cards, no matter how tall the content of one is.

    2. Make all cards open the modal: Modify the JavaScript so that clicking the "View Tracklist" button on any card opens the modal window. Use event delegation or dynamically add event listeners to each button.

    3. Display album-specific content in the modal: When a card's button is clicked, populate the modal with that album's information:
        Modal title should show: "{Artist} - {Album}"
        Modal body should display the complete tracklist with track numbers, titles, and lengths
        Format the tracklist as a numbered list or table for better readability

    4. Add Spotify links to tracks: Each track in the JSON has a url property linking to Spotify. Make each track title in the modal clickable, opening the Spotify link in a new tab. Style these links appropriately using Bootstrap classes.

    5. Improve the modal footer: Remove the "Save changes" button (it's not needed). Change the "Close" button to say "Close Tracklist" and consider adding a "Play on Spotify" button that opens the first track of the album.

    6. Add a search/filter feature: Create an input field above the album grid that allows users to filter albums by artist name or album title in real-time as they type. Show only matching albums and hide non-matching ones.

    7. Enhance card styling with your own custom CSS:
        Add hover effects to cards (scale transform, shadow increase)
        Ensure all album images have consistent aspect ratios
        Add smooth transitions for hover effects
        Consider adding a subtle overlay on card images with the album name

    8. Sort albums alphabetically: Add dropdown buttons or tabs that allow users to sort the displayed albums by:
        Artist name (A-Z)
        Album name (A-Z)
        Number of tracks (ascending/descending)

    9. Track statistics in modal: In the modal body, before the tracklist, display summary statistics:
        Total number of tracks
        Total album duration (sum of all track lengths)
        Average track length
        Longest and shortest tracks

    10. Make it mobile-friendly: Test the layout on mobile devices and ensure:
        Cards stack properly on small screens
        Modal is readable and scrollable on mobile
        Touch targets (buttons) are appropriately sized
        Consider adding a "Back to Top" button for long album lists
