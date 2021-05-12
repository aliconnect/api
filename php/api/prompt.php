<?php
class prompt {
  public function share() {
    (new account())->create_guest();
  }
}
