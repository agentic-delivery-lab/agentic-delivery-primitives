# Primitive hooks

Hooks are opt-in, reviewed execution adapters. A hook must declare its
trigger, allowed inputs, side effects, tool policy, and rollback behavior.
Hooks may not contain credentials, mutate lifecycle state directly, or replace
the Delivery Control Plane authorization boundary.

