<script>
  import { generateName } from "../models/Name";
  import nationalities from "../data/nationalities";

  const placeholder = "John";
  let inputName = "";
  let name = "";
  let country = nationalities[0].id;

  function handleGenerate() {
    if (inputName) {
      name = generateName(inputName, country);
    }
  }
</script>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .field {
    min-width: 300px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #eee;
    padding: 0 10px;
    display: block;
  }

  .selectInput {
    margin-top: 10px;
  }

  .generateBtn {
    border-radius: 5px;
    border: 1px solid #eee;
    padding: 5px;
    margin-top: 10px;
  }

  .generateBtn:hover {
    cursor: pointer;
  }

  .generatedName {
    font-size: 18px;
    font-weight: 700;
  }
</style>

<div class="wrapper">
  <input bind:value={inputName} class="field" {placeholder} />
  <select bind:value={country} class="field selectInput">
    {#each nationalities as nationality}
      <option value={nationality.id}>{nationality.value}</option>
    {/each}
  </select>
  <button class="generateBtn" on:click={handleGenerate}>
    Generate my name
  </button>
  {#if name}
    <p>Your jihad name is :</p>
    <p class="generatedName">{name}</p>
  {/if}
</div>
