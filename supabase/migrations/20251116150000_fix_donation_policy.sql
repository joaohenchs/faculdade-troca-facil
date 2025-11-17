-- Fix trade_requests policy to support both trades and donations
-- For trades: the requester owns the offered_item_id
-- For donations: the requester does NOT own the requested_item (they are asking for it)

DROP POLICY IF EXISTS "Users can create trade requests" ON public.trade_requests;

-- Allow authenticated users to create trade requests
-- The check ensures user owns the offered_item OR the items are the same (donation case)
CREATE POLICY "Users can create trade requests"
  ON public.trade_requests FOR INSERT
  WITH CHECK (
    auth.uid() IN (SELECT user_id FROM public.items WHERE id = offered_item_id)
    OR
    (offered_item_id = requested_item_id AND
     auth.uid() NOT IN (SELECT user_id FROM public.items WHERE id = requested_item_id))
  );
