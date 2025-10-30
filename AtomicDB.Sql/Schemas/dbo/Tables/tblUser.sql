CREATE TABLE [dbo].[tblUser] (
    [UserId]        INT              IDENTITY (10000, 1) NOT FOR REPLICATION NOT NULL,
    [Name]          NVARCHAR (100)   NOT NULL,
    [EntityId]      UNIQUEIDENTIFIER NOT NULL   DEFAULT (newid()),
    [IsActive]		BIT				 NOT NULL	CONSTRAINT [DF_tblUser_IsActive] DEFAULT ((1)),
    [CreatedDate]	DATETIME2	     NOT NULL	CONSTRAINT [DF_tblUser_CreatedDate] DEFAULT (GETUTCDATE()),
    CONSTRAINT [PK_tblUser_UserId] PRIMARY KEY CLUSTERED ([UserId] ASC)
);
GO