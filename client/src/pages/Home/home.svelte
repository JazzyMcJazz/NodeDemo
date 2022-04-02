<script>

    import HomeSection from "../../components/HomeSection/HomeSection.svelte";
    import {onMount} from "svelte";
    import {base_url} from "../../stores/general-store";
    import HomeBanner from "../../components/HomeSection/HomeBanner.svelte";

    let mostPopularCourses = [];
    let newCourses = [];

    onMount(async () => {
        let url = `${$base_url}/courses/most-popular`
        let response = await fetch(url);
        let data = await response.json();
        mostPopularCourses = data.data;

        url = `${$base_url}/courses/new`
        response = await fetch(url);
        data = await response.json();
        newCourses = data.data;
    });
</script>

<HomeBanner/>
<HomeSection title={"Most Popular Courses"} courses={mostPopularCourses}/>
<HomeSection title={"New Courses"} courses={newCourses}/>