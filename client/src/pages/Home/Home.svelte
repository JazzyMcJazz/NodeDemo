<script>
    import HomeSection from "../../components/HomeSection/HomeSection.svelte";
    import {base_url} from "../../stores/general-store";
    import HomeBanner from "../../components/HomeSection/HomeBanner.svelte";

    const mostPopularCoursesURL = `${$base_url}/courses/most-popular`;
    const newCoursesURL = `${$base_url}/courses/new`;
</script>

<HomeBanner/>
<HomeSection title={"Most Popular Courses"} url={mostPopularCoursesURL}/>
<HomeSection title={"New Courses"} url={newCoursesURL}/>