<script>
  const placeholder = "John";
  let inputName = "";
  let name = "";

  function handleGenerate() {
    name = `Abu ${inputName}`;
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
</style>

<div class="wrapper">
  <input bind:value={inputName} class="nameInput" {placeholder} />
  <button class="generateBtn" on:click={handleGenerate}>
    Generate my name
  </button>
  {#if name}
    <p>Your jihad name is :</p>
    <p>{name}</p>
  {/if}
</div>
