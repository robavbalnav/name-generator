<script>
  import { getSecondName } from "../models/secondName";
  import { shouldAddCivility } from "../models/civility";

  const placeholder = "John";
  let inputName = "";
  let name = "";

  function handleGenerate() {
    if (inputName) {
      name = `${shouldAddCivility()}${inputName} ${getSecondName()}`;
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

  .nameInput {
    min-width: 300px;
    height: 30px;
    border-radius: 5px;
    border: 1px solid #eee;
    padding: 0 10px;
    display: block;
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
  <input bind:value={inputName} class="nameInput" {placeholder} />
  <button class="generateBtn" on:click={handleGenerate}>
    Generate my name
  </button>
  {#if name}
    <p>Your jihad name is :</p>
    <p class="generatedName">{name}</p>
  {/if}
</div>
